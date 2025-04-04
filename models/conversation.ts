import { Model, DataTypes, Sequelize } from "sequelize";
import db from "../models";

interface ConversationAttributes {
  id?: number;
  userId: number;
  title?: string;
}

class Conversation extends Model<ConversationAttributes> implements ConversationAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: { [key: string]: any }) {
    Conversation.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Conversation.hasMany(models.ConversationDetail, { foreignKey: "conversationId", as: "details" });
  }
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db.sequelize as unknown as Sequelize,
    tableName: "chats", // Đồng bộ với ConversationDetail
    timestamps: true,
  }
);

db.Conversation = Conversation;
export default Conversation;
