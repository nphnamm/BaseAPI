import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
require("dotenv");
const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_KEY as string); // Use environment variable for security
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
interface CustomRequest extends Request {
  user?: any;
}
const Conversation = db.Conversation;

const ConversationDetail = db.ConversationDetail;

// Create Conversation
export const createConversation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Conversation:", Conversation);

      const { userId, title } = req.body;

      console.log("user", userId, title);

      const conversation = await Conversation.create({
        id: uuidv4(),
        userId: userId,
        title: title ? title : "untitled",
      });

      res.status(201).json(conversation);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// Get all conversations for a user
export const getConversations = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as CustomRequest).user.id;
      const conversations = await Conversation.findAll({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({
        success: true,
        conversations: conversations,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const resumeConversation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt, conversationId } = req.body;

      if (!prompt) {
        return next(new ErrorHandler("Prompt is required", 400));
      }

      const conversationSession = await ConversationDetail.findOne({
        where: {
          conversationId: conversationId,
        },
      });
      if (!conversationSession) {
        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        ConversationDetail.create({
          id: uuidv4(),
          conversationId: conversationId,
          message: prompt,
          response: answer,
          order: 1,
        });
        const titlePrompt = `Summarize the following conversation in a short, descriptive title:\n\nUser: ${prompt}\nAI: ${answer}`;
        const titleResult = await model.generateContent(titlePrompt);

        const newTitle = titleResult.response.text().trim();

        const currentConversation = await Conversation.findOne({
          where: { id: conversationId },
        });
        if (currentConversation) {
          await currentConversation.update({ title: newTitle });
        }

        res.status(200).json({
          success: true,
          message: answer,
        });
      } else {
        const history = [];

        const allConversation = await ConversationDetail.findAll({
          where: {
            conversationId: conversationId,
          },
        });
        console.log("1", allConversation.length);
        // ConversationDetail.create({
        //   id: uuidv4(),
        //   conversationId: conversationId,
        //   message: prompt,
        //   response: answer,
        //   order: 2,
        // });
        for (const detail of allConversation) {
          const userMessage = detail.dataValues?.message;
          const modelResponse = detail.dataValues?.response;
          if (userMessage && modelResponse) {
            history.push({
              role: "user",
              parts: [{ text: userMessage }],
            });
            history.push({
              role: "model",
              parts: [{ text: modelResponse }],
            });
          }
        }
        const chat = model.startChat({
          history,
        });
        const newRes = await chat.sendMessageStream(prompt);
        let conversationText = "";
        for await (const chunk of newRes.stream) {
          const chunkText = chunk.text();
          conversationText += chunkText;
        }

        ConversationDetail.create({
          id: uuidv4(),
          conversationId: conversationId,
          message: prompt,
          response: conversationText,
          order: allConversation?.length + 1,
        });

        res.status(200).json({
          success: true,
          message: conversationText,
        });
      }
    } catch (error: any) {
      console.error(error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getConversationDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.body;
      const conversations = await ConversationDetail.findAll({
        where: {
          conversationId,
        },
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({
        success: true,
        conversations: conversations,
      });
    } catch (error) {
      next(error);
    }
  }
);
