import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import * as userStatsService from "../services/userStats.service";

interface CustomRequest extends Request {
  user?: any;
}

export const getUserStats = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      await userStatsService.getUserStats(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const addXP = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      const { amount } = req.body;

      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return next(new ErrorHandler("Invalid XP amount", 400));
      }

      await userStatsService.addXP(userId, amount, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateStreak = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      await userStatsService.updateStreak(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const addCoins = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      const { amount } = req.body;

      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return next(new ErrorHandler("Invalid coin amount", 400));
      }

      await userStatsService.addCoins(userId, amount, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const addBadge = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      const { badgeId } = req.body;

      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      if (!badgeId || typeof badgeId !== 'string') {
        return next(new ErrorHandler("Invalid badge ID", 400));
      }

      await userStatsService.addBadge(userId, badgeId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const removeBadge = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      const { badgeId } = req.body;

      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      if (!badgeId || typeof badgeId !== 'string') {
        return next(new ErrorHandler("Invalid badge ID", 400));
      }

      await userStatsService.removeBadge(userId, badgeId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const spendCoins = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user?.id;
      const { amount } = req.body;

      if (!userId) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return next(new ErrorHandler("Invalid coin amount", 400));
      }

      await userStatsService.spendCoins(userId, amount, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
); 