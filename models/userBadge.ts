import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from '../models';

export interface UserBadgeAttributes {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserBadgeCreationAttributes extends Optional<UserBadgeAttributes, "id" | "earnedAt"> { }

export class UserBadge extends Model<UserBadgeAttributes, UserBadgeCreationAttributes> implements UserBadgeAttributes {
  public id!: string;
  public userId!: string;
  public badgeId!: string;
  public earnedAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: { [key: string]: any }) {
    UserBadge.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    UserBadge.belongsTo(models.Badge, { foreignKey: "badgeId", as: "badge" });
  }
}

UserBadge.init(
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
    badgeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Badges",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    modelName: "UserBadge",
    indexes: [
      {
        unique: true,
        fields: ["userId", "badgeId"],
      },
    ],
  }
);

// Add the model to db
db.UserBadge = UserBadge;

export default UserBadge; 