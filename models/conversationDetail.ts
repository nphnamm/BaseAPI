import { Conversation } from "./conversation";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from "../models";

export interface ConversationDetailAttributes {
  id: string;
  conversationId: string;
  message: string;
  response: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConversationDetailCreationAttributes
  extends Optional<
    ConversationDetailAttributes,
    | "id"
    | "conversationId"
    | "message"
    | "response"
    | "order"
    | "createdAt"
    | "updatedAt"
  > {}

export class ConversationDetail
  extends Model<
    ConversationDetailAttributes,
    ConversationDetailCreationAttributes
  >
  implements ConversationDetailAttributes
{
  public id!: string;
  public conversationId!: string;
  public message!: string;
  public response!: string;
  public order!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public static associate(models: { [key: string]: any }) {
    ConversationDetail.belongsTo(models.Conversation, {
      foreignKey: "conversationId",
      as: "conversation",
    });
  }
}

ConversationDetail.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.STRING, // Chỉnh sửa từ UUID thành INTEGER để khớp với Conversation.id
      allowNull: false,
      references: {
        model: "Conversations", // Phải khớp với tableName trong Conversation
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "ConversationDetail",
  }
);

// Add the model to db
db.ConversationDetail = ConversationDetail;

export default ConversationDetail;
