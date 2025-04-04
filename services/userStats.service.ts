import { Response } from "express";
import { redis } from "../utils/redis";
import { UserStats } from '../models/userStats';
import { Badge } from '../models/badge';
import { UserBadge } from '../models/userBadge';
import ErrorHandler from "../utils/errorHandler";
import db from '../models';

// Cache keys
const USER_STATS_KEY = (userId: string) => `userStats:${userId}`;
const USER_BADGES_KEY = (userId: string) => `userBadges:${userId}`;

// Get user stats from cache or database
export const getUserStats = async (userId: string, res: Response) => {
  try {
    // Try to get from cache
    const cachedStats = await redis.get(USER_STATS_KEY(userId));
    if (cachedStats) {
      const stats = JSON.parse(cachedStats);
      return res.status(200).json({
        success: true,
        stats
      });
    }

    // Get from database
    let stats = await UserStats.findOne({ where: { userId } });
    if (!stats) {
      // Create default stats if not exists
      stats = await UserStats.create({
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Cache the result
    await redis.set(USER_STATS_KEY(userId), JSON.stringify(stats), 'EX', 3600); // 1 hour

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Add XP and handle level up
export const addXP = async (userId: string, amount: number, res: Response) => {
  const transaction = await db.sequelize.transaction();

  try {
    const stats = await UserStats.findOne({ where: { userId }, transaction });
    if (!stats) {
      throw new ErrorHandler("User stats not found", 404);
    }

    const didLevelUp = await stats.addXP(amount);
    await stats.save({ transaction });

    // If leveled up, check for level-based badges
    if (didLevelUp) {
      const levelBadges = await Badge.findAll({
        where: {
          type: 'level',
          requirement: stats.level.toString()
        },
        transaction
      });

      for (const badge of levelBadges) {
        await awardBadge(userId, badge.id, transaction);
      }
    }

    await transaction.commit();

    // Update cache
    await redis.set(USER_STATS_KEY(userId), JSON.stringify(stats), 'EX', 3600);

    res.status(200).json({
      success: true,
      stats,
      didLevelUp
    });
  } catch (error: any) {
    await transaction.rollback();
    throw new ErrorHandler(error.message, 500);
  }
};

// Update streak
export const updateStreak = async (userId: string, res: Response) => {
  const transaction = await db.sequelize.transaction();

  try {
    const stats = await UserStats.findOne({ where: { userId }, transaction });
    if (!stats) {
      throw new ErrorHandler("User stats not found", 404);
    }

    const oldStreak = stats.streak;
    await stats.updateStreak();
    await stats.save({ transaction });

    // Check for streak-based badges
    if (stats.streak > oldStreak) {
      const streakBadges = await Badge.findAll({
        where: {
          type: 'streak',
          requirement: stats.streak.toString()
        },
        transaction
      });

      for (const badge of streakBadges) {
        await awardBadge(userId, badge.id, transaction);
      }
    }

    await transaction.commit();

    // Update cache
    await redis.set(USER_STATS_KEY(userId), JSON.stringify(stats), 'EX', 3600);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error: any) {
    await transaction.rollback();
    throw new ErrorHandler(error.message, 500);
  }
};

// Add coins
export const addCoins = async (userId: string, amount: number, res: Response) => {
  try {
    const stats = await UserStats.findOne({ where: { userId } });
    if (!stats) {
      throw new ErrorHandler("User stats not found", 404);
    }

    stats.coins += amount;
    await stats.save();

    // Update cache
    await redis.set(USER_STATS_KEY(userId), JSON.stringify(stats), 'EX', 3600);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Spend coins
export const spendCoins = async (userId: string, amount: number, res: Response) => {
  try {
    const stats = await UserStats.findOne({ where: { userId } });
    if (!stats) {
      throw new ErrorHandler("User stats not found", 404);
    }

    if (stats.coins < amount) {
      throw new ErrorHandler("Not enough coins", 400);
    }

    stats.coins -= amount;
    await stats.save();

    // Update cache
    await redis.set(USER_STATS_KEY(userId), JSON.stringify(stats), 'EX', 3600);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Award a badge to user
const awardBadge = async (userId: string, badgeId: string, transaction?: any) => {
  const badge = await Badge.findByPk(badgeId, { transaction });
  if (!badge) {
    throw new ErrorHandler("Badge not found", 404);
  }

  // Check if user already has the badge
  const existingBadge = await UserBadge.findOne({
    where: { userId, badgeId },
    transaction
  });

  if (!existingBadge) {
    // Award the badge
    await UserBadge.create({
      userId,
      badgeId,
      earnedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction });

    // Award XP and coins if specified
    if (badge.xpReward > 0 || badge.coinReward > 0) {
      const stats = await UserStats.findOne({ where: { userId }, transaction });
      if (stats) {
        if (badge.xpReward > 0) {
          await stats.addXP(badge.xpReward);
        }
        if (badge.coinReward > 0) {
          stats.coins += badge.coinReward;
        }
        await stats.save({ transaction });
      }
    }

    // Invalidate cache
    await redis.del(USER_BADGES_KEY(userId));
    await redis.del(USER_STATS_KEY(userId));
  }
};

// Get user badges
export const getUserBadges = async (userId: string, res: Response) => {
  try {
    // Try to get from cache
    const cachedBadges = await redis.get(USER_BADGES_KEY(userId));
    if (cachedBadges) {
      const badges = JSON.parse(cachedBadges);
      return res.status(200).json({
        success: true,
        badges
      });
    }

    // Get from database with badge details
    const badges = await UserBadge.findAll({
      where: { userId },
      include: [{
        model: Badge,
        as: 'badge'
      }],
      order: [['earnedAt', 'DESC']]
    });

    // Cache the result
    await redis.set(USER_BADGES_KEY(userId), JSON.stringify(badges), 'EX', 3600);

    res.status(200).json({
      success: true,
      badges
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Check badge progress
export const checkBadgeProgress = async (userId: string, res: Response) => {
  try {
    const stats = await UserStats.findOne({ where: { userId } });
    if (!stats) {
      throw new ErrorHandler("User stats not found", 404);
    }

    // Get all badges
    const allBadges = await Badge.findAll();
    
    // Get user's earned badges
    const earnedBadges = await UserBadge.findAll({
      where: { userId },
      attributes: ['badgeId']
    });
    const earnedBadgeIds = earnedBadges.map(ub => ub.badgeId);

    // Calculate progress for each badge
    const badgeProgress = allBadges.map(badge => {
      const earned = earnedBadgeIds.includes(badge.id);
      let progress = 0;

      switch (badge.type) {
        case 'level':
          progress = (stats.level / parseInt(badge.requirement)) * 100;
          break;
        case 'streak':
          progress = (stats.streak / parseInt(badge.requirement)) * 100;
          break;
        // Add other badge type progress calculations
      }

      return {
        badge,
        earned,
        progress: Math.min(progress, 100)
      };
    });

    res.status(200).json({
      success: true,
      badgeProgress
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Add badge to user
export const addBadge = async (userId: string, badgeId: string, res: Response) => {
  try {
    const badge = await Badge.findByPk(badgeId);
    if (!badge) {
      throw new ErrorHandler("Badge not found", 404);
    }

    // Check if user already has the badge
    const existingBadge = await UserBadge.findOne({
      where: { userId, badgeId }
    });

    if (!existingBadge) {
      // Award the badge
      await UserBadge.create({
        userId,
        badgeId,
        earnedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Award XP and coins if specified
      if (badge.xpReward > 0 || badge.coinReward > 0) {
        const stats = await UserStats.findOne({ where: { userId } });
        if (stats) {
          if (badge.xpReward > 0) {
            await stats.addXP(badge.xpReward);
          }
          if (badge.coinReward > 0) {
            stats.coins += badge.coinReward;
          }
          await stats.save();
        }
      }

      // Invalidate cache
      await redis.del(USER_BADGES_KEY(userId));
      await redis.del(USER_STATS_KEY(userId));
    }

    res.status(200).json({
      success: true,
      message: "Badge added successfully"
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

// Remove badge from user
export const removeBadge = async (userId: string, badgeId: string, res: Response) => {
  try {
    const badge = await UserBadge.findOne({
      where: { userId, badgeId }
    });

    if (!badge) {
      throw new ErrorHandler("Badge not found", 404);
    }

    await badge.destroy();

    // Invalidate cache
    await redis.del(USER_BADGES_KEY(userId));

    res.status(200).json({
      success: true,
      message: "Badge removed successfully"
    });
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
}; 