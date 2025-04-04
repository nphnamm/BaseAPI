import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from '../models';

export interface UserProgressAttributes {
  id: number;
  sessionId: number;
  cardId: number;
  isCorrect: boolean;
  timesAnswered: number;
  answeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProgressCreationAttributes
  extends Optional<UserProgressAttributes, "id" | "answeredAt"> { }

export class UserProgress
  extends Model<UserProgressAttributes, UserProgressCreationAttributes>
  implements UserProgressAttributes {
  public id!: number;
  public sessionId!: number;
  public cardId!: number;
  public isCorrect!: boolean;
  public timesAnswered!: number;
  public answeredAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public static associate(models: { [key: string]: any }) {
    UserProgress.belongsTo(models.UserSession, { foreignKey: "sessionId", as: "session" });
    UserProgress.belongsTo(models.Card, { foreignKey: "cardId", as: "card" });
  }
}

UserProgress.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "UserSessions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    cardId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Cards",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    timesAnswered: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    answeredAt: {
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
    modelName: "UserProgress",
  }
);

// Add the model to db
db.UserProgress = UserProgress;

export default UserProgress;
