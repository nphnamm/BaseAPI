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
export const startOrResumeSession = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, setId, sessionType } = req.body;

      let session = await UserSession.findOne({
        where: { userId, setId, sessionType },
      });

      if (!session) {
        const sessionId = uuidv4();
        session = await UserSession.create({
          id: sessionId,
          userId,
          setId,
          sessionType,
          completed: false,
        });
      }

      const answeredCards = await UserProgress.findAll({
        where: { sessionId: session.id },
        attributes: ["cardId", "timesAnswered", "isCorrect"],
      });
      // console.log("Answered Cards:", answeredCards.map((a: any) => a.toJSON())); // Debug log

      const answeredCardIds: number[] = answeredCards
        .filter((card: any) => card.isCorrect)
        .map((card: any) => card.cardId);
      // console.log("Answered Cards id:", answeredCardIds); // Debug log

      const remainingCards = await Card.findAll({
        where: { setId, id: { [Op.notIn]: answeredCardIds } },
      });
      // console.log("Remaining Cards:", remainingCards.map((c: any) => c.toJSON())); // Debug log
      // Gộp dữ liệu `timesAnswered` từ bảng `UserProgress`
      let result;
      if (answeredCards.length > 0) {
        result = remainingCards.map((card: any) => {
          const answeredCard = answeredCards.find(
            (p: any) => p.cardId === card.id
          );
          return {
            id: card.id,
            term: card.term,
            definition: card.definition,
            setId: card.setId,
            position: card.position,
            statusId: card.statusId,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt,
            imageUrl: card.imageUrl,
            timesAnswered: answeredCard ? answeredCard.timesAnswered : 0,
          };
        });
      } else {
        result = remainingCards.map((card: any) => {
          return {
            id: card.id,
            term: card.term,
            definition: card.definition,
            setId: card.setId,
            position: card.position,
            statusId: card.statusId,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt,
            timesAnswered: 0,
          };
        });
      }

      // Nếu không còn thẻ nào chưa được trả lời đúng, đánh dấu session hoàn thành
      if (remainingCards.length == 0) {
        await session.update({ completed: true });
      }

      res.json({
        sessionId: session.id,
        remainingCards: result,
        isCompleted: session.completed,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all sets
// export const getMultipleChoices = CatchAsyncError(
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const { setId, cardId } = req.params;

//             const card = await Card.findByPk(cardId);
//             if (!card) return res.status(404).json({ message: "Card not found" });

//             const wrongAnswers = await Card.findAll({
//                 where: { setId, id: { [Op.not]: cardId } },
//                 limit: 3
//             });

//             const choices = [...wrongAnswers.map((c: any) => c.definition), card.definition];
//             const shuffledChoices = choices.sort(() => Math.random() - 0.5);

//             return res.json({  // ✅ Thêm return
//                 question: card.term,
//                 choices: shuffledChoices,
//                 correctAnswer: card.definition
//             });
//         } catch (error: any) {
//             return next(new ErrorHandler(error.message, 500));
//         }
//     }
// );

export const getMultipleChoices = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { setId, cardId } = req.params;

      const card = await Card.findByPk(cardId);
      if (!card) return res.status(404).json({ message: "Card not found" });

      // Lấy 3 đáp án sai (các card khác trong cùng bộ)
      const wrongAnswers = await Card.findAll({
        where: { setId, id: { [Op.not]: cardId } },
        limit: 3,
      });

      // Tạo danh sách các lựa chọn (bao gồm cả đáp án đúng)
      const choices = [...wrongAnswers, card];

      // Trộn ngẫu nhiên danh sách lựa chọn
      const shuffledChoices = choices.sort(() => Math.random() - 0.5);

      return res.json({
        question: {
          id: card.id,
          term: card.term,
        },
        choices: shuffledChoices.map((c) => ({
          id: c.id,
          term: c.term,
          definition: c.definition,
        })),
        correctAnswerId: card.id,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get Card by FolderId
export const getCardBySetId = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const sets = await Card.findAll({
        where: { setId: id },
        order: [["createdAt", "DESC"]],
      });
      if (!sets) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      res.status(200).json({ success: true, sets });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// // Get Folder by ID
// export const getSetByUserId = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const userId = (req as CustomRequest).user.id;
//       const folders  = await Card.findAll({
//         where: {userId},
//         order:[["createdAt","DESC"]]
//       })
//       if (!folders) {
//         return next(new ErrorHandler("Folder not found", 404));
//       }

//       res.status(200).json({ success: true, folders });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// Update Card
export const updateCard = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { term, setId, definition, position, statusId } = req.body;

      const card = await Card.findByPk(id);

      if (!card) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      card.term = term ?? card.term;
      card.definition = definition ?? card.definition;
      card.setId = setId ?? card.setId;
      card.statusId = statusId ?? card.statusId;
      card.position = position ?? card.position;

      await card.save();

      res.status(200).json({ success: true, card });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// // // Delete Folder
// // export const deleteFolder = CatchAsyncError(
// //   async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       const { id } = req.params;
// //       const folder = await Folder.findByPk(id);

// //       if (!folder) {
// //         return next(new ErrorHandler("Folder not found", 404));
// //       }

// //       await folder.destroy();

// //       res.status(200).json({ success: true, message: "Folder deleted" });
// //     } catch (error: any) {
// //       return next(new ErrorHandler(error.message, 500));
// //     }
// //   }
// // );
