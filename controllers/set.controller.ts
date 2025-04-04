import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
const Set = db.Set;

interface CustomRequest extends Request {
  user?: any;
}
// Create Folder
export const createSet = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        description,
        folderId,
        isPublic,
        statusId,
        isDraft,
        cardCount,
      } = req.body;
      const userId = (req as CustomRequest).user.id;

      if (!title) {
        return next(new ErrorHandler("Title name is required", 400));
      }

      const set = await Set.create({
        id: uuidv4(), // Tạo UUID v4 cho folderId
        title,
        description,
        folderId,
        userId,
        isPublic,
        isDraft,
        statusId,
        cardCount,
      });

      res.status(201).json({
        success: true,
        set: set,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all sets
export const getAllSets = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sets = await Set.findAll();
      res.status(200).json({ success: true, sets });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//Get Set by FolderId
export const getSetByFolderId = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { folderId } = req.body;

      const sets = await Set.findAll({
        where: { folderId: id },
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

// Get Folder by ID
export const getSetByUserId = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as CustomRequest).user.id;
      const folders = await Set.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      if (!folders) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      res.status(200).json({ success: true, folders });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update Folder
export const updateSet = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, statusId, isPublic, userId, isDraft } =
        req.body;

      const set = await Set.findByPk(id);

      if (!set) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      set.title = title ?? set.title;
      set.description = description ?? set.description;
      set.isPublic = isPublic ?? set.isPublic;
      set.statusId = statusId ?? set.statusId;
      set.userId = userId ?? set.userId;
      set.isDraft = isDraft ?? set.isDraft;
      await set.save();

      res.status(200).json({ success: true, set });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// // Delete Folder
// export const deleteFolder = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const folder = await Folder.findByPk(id);

//       if (!folder) {
//         return next(new ErrorHandler("Folder not found", 404));
//       }

//       await folder.destroy();

//       res.status(200).json({ success: true, message: "Folder deleted" });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );
