import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from '../models';

export interface UserStatsAttributes {
  id: string;
  userId: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  streak: number;
  lastStreakDate: Date;
  coins: number;
  badges: string[]; // Stored as JSON array of badge IDs
  createdAt: Date;
  updatedAt: Date;
}

interface UserStatsCreationAttributes
  extends Optional<UserStatsAttributes, "id" | "level" | "currentXP" | "requiredXP" | "streak" | "coins" | "badges" | "lastStreakDate"> { }

export class UserStats
  extends Model<UserStatsAttributes, UserStatsCreationAttributes>
  implements UserStatsAttributes {
  public id!: string;
  public userId!: string;
  public level!: number;
  public currentXP!: number;
  public requiredXP!: number;
  public streak!: number;
  public lastStreakDate!: Date;
  public coins!: number;
  public badges!: string[];
  public createdAt!: Date;
  public updatedAt!: Date;

  // Calculate if streak is active
  public isStreakActive(): boolean {
    const today = new Date();
    const lastDate = new Date(this.lastStreakDate);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }

  // Add XP and handle level up
  public async addXP(amount: number): Promise<boolean> {
    this.currentXP += amount;
    let didLevelUp = false;
    
    while (this.currentXP >= this.requiredXP) {
      this.level += 1;
      this.currentXP -= this.requiredXP;
      this.requiredXP = Math.floor(this.requiredXP * 1.5); // Increase XP requirement for next level
      didLevelUp = true;
    }
    
    await this.save();
    return didLevelUp;
  }

  // Update streak
  public async updateStreak(): Promise<void> {
    const today = new Date();
    const lastDate = new Date(this.lastStreakDate);
    
    if (this.isStreakActive()) {
      // Only increment if it's a new day
      if (today.getDate() !== lastDate.getDate()) {
        this.streak += 1;
        this.lastStreakDate = today;
      }
    } else {
      // Reset streak if more than 1 day has passed
      this.streak = 1;
      this.lastStreakDate = today;
    }
    
    await this.save();
  }

  public static associate(models: { [key: string]: any }) {
    UserStats.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

UserStats.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    currentXP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    requiredXP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100, // Base XP required for first level
    },
    streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastStreakDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    badges: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "UserStats",
  }
);

// Add the model to db
db.UserStats = UserStats;

export default UserStats; 