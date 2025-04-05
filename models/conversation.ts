import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from "../models";

export interface ConversationAttributes {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationCreationAttributes
  extends Optional<
    ConversationAttributes,
    "id" | "userId" | "title" | "createdAt" | "updatedAt"
  > {}

export class Conversation
  extends Model<ConversationAttributes, ConversationCreationAttributes>
  implements ConversationAttributes
{
  public id!: string;
  public userId!: string;
  public title!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: { [key: string]: any }) {
    Conversation.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

Conversation.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "Conversation",
  }
);

// Add the model to db
db.Conversation = Conversation;

export default Conversation;
