import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
const Conversation = db.Conversation;
const ConversationDetail = db.ConversationDetail;

interface CustomRequest extends Request {
  user?: any;
}
// Create Conversation
export const createConversation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const conversation = await Conversation.create({ userId });
      res.status(201).json(conversation);
    } catch (error) {
      next(error);
    }
  }
);

// Get all conversations for a user
export const getConversations = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const { userId } = req.body;
        const conversations = await Conversation.findAll({
            where: { userId },
            include: [{ model: ConversationDetail, as: 'conversationDetails' }],
        });
        res.status(200).json(conversations);
    } catch (error) {
        next(error);
    }
  }
);



