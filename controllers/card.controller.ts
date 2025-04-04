import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from 'uuid';
const Card = db.Card;

interface CustomRequest extends Request {
  user?: any;
}
// Create Folder
export const createCard = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { term, definition, setId,position,statusId,imageUrl  } = req.body;

      if (!term) {
        return next(new ErrorHandler("Folder name is required", 400));
      }
 

      const card = await Card.create({
        id: uuidv4(), // Tạo UUID v4 cho folderId
        term,
        definition,
        setId,
        position,
        statusId,
        imageUrl
      });

      res.status(201).json({
        success: true,
        card: card,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all sets 
export const getAllCards = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sets = await Card.findAll();
      res.status(200).json({ success: true, sets });
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
      
      const sets  = await Card.findAll({
        where: {setId:id},
        order:[["createdAt","DESC"]]
      })
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
      const { term, setId, definition, position,statusId,imageUrl } = req.body;

      const card = await Card.findByPk(id);

      if (!card) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      card.term = term ?? card.term;
      card.definition = definition ?? card.definition;
      card.setId = setId ?? card.setId;
      card.statusId = statusId ?? card.statusId;
      card.position = position ?? card.position;
      card.imageUrl = imageUrl ?? card.imageUrl;

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
