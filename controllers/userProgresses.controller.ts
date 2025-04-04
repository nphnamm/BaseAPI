import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
const UserSession = db.UserSession;
const UserProgress = db.UserProgress;
const Card = db.Card;

interface CustomRequest extends Request {
  user?: any;
}
// Create Folder
export const UpdateProgress = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, cardId, isCorrect } = req.body;

      const existingProgress = await UserProgress.findOne({
        where: {
          sessionId: sessionId,
          cardId: cardId,
        },
      });
      console.log("is", existingProgress);
      let result;
      if (!existingProgress) {
        // Update existing record
        result = await UserProgress.create({
          id: uuidv4(),
          sessionId,
          cardId,
          isCorrect,
          timesAnswered: 1,
        });
      } else {
        result = await existingProgress.update({
          isCorrect: isCorrect,
          timesAnswered: existingProgress.timesAnswered + 1,
        });
      }

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const RestartSession = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.body;

      const session = await UserSession.findByPk(sessionId);
      //   console.log("session", session);
      session.completed = false;
      await session.save();

      const existingProgress = await UserProgress.findAll({
        where: {
          sessionId: sessionId,
        },
      });
      await Promise.all(
        existingProgress.map(async (progress: any) => {
          progress.isCorrect = false;
          progress.timesAnswered = 0;
          await progress.save();
        })
      );
      console.log(existingProgress);
      console.log("is", existingProgress);

      res.status(200).json({
        success: true,
        message: "restart successfully!",
        session,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
