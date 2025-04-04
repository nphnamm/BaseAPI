import { Model, DataTypes, Sequelize } from "sequelize";
import db from "../models";

interface ConversationDetailAttributes {
  id?: number;
  conversationId: number;
  message: string;
  response: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class ConversationDetail extends Model<ConversationDetailAttributes> implements ConversationDetailAttributes {
  public id!: number;
  public conversationId!: number;
  public message!: string;
  public response!: string;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    this.belongsTo(models.Conversation, {
      foreignKey: "conversationId",
      as: "conversation",
    });
  }
}

ConversationDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER, // Chỉnh sửa từ UUID thành INTEGER để khớp với Conversation.id
      allowNull: false,
      references: {
        model: "chats", // Phải khớp với tableName trong Conversation
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize as unknown as Sequelize,
    tableName: "conversationDetails",
    timestamps: true,
  }
);

db.ConversationDetail = ConversationDetail;
export default ConversationDetail;
