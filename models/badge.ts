import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from '../models';

export interface BadgeAttributes {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: string; // e.g., 'achievement', 'level', 'special'
  requirement: string;
  xpReward: number;
  coinReward: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BadgeCreationAttributes extends Optional<BadgeAttributes, "id" | "xpReward" | "coinReward"> { }

export class Badge extends Model<BadgeAttributes, BadgeCreationAttributes> implements BadgeAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public imageUrl!: string;
  public type!: string;
  public requirement!: string;
  public xpReward!: number;
  public coinReward!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: { [key: string]: any }) {
    // Add associations if needed
  }
}

Badge.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['achievement', 'level', 'special', 'streak', 'collection']]
      }
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xpReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    coinReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    modelName: "Badge",
  }
);

// Add the model to db
db.Badge = Badge;

export default Badge; 