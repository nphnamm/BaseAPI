import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from 'uuid';
const Folder = db.Folder;

interface CustomRequest extends Request {
  user?: any;
}
// Create Folder
export const createFolder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, isPublic, statusId } = req.body;
      const userId = (req as CustomRequest).user.id;
      const folderId =  uuidv4();
      
      if (!name) {
        return next(new ErrorHandler("Folder name is required", 400));
      }
      // console.log('name',)
      // console.log('folderId',folderId)
      // console.log('description',description)
      // console.log('userId',userId)
      // console.log('statusId',statusId)
      // console.log('isPublic',isPublic)

      const newFolder = await Folder.create({
        id: uuidv4(), // Tạo UUID v4 cho folderId
        name,
        description,
        userId,
        isPublic,
        statusId
      });

      res.status(201).json({
        success: true,
        folder: newFolder,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all Folders
export const getAllFolders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folders = await Folder.findAll();
      res.status(200).json({ success: true, folders });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get Folder by ID
export const getFolderByUserId = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as CustomRequest).user.id;
      const folders  = await Folder.findAll({
        where: {userId},
        order:[["createdAt","DESC"]]
      })
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
export const updateFolder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, statusId, isPublic } = req.body;

      const folder = await Folder.findByPk(id);

      if (!folder) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      folder.name = name ?? folder.name;
      folder.description = description ?? folder.description;
      folder.isPublic = isPublic ?? folder.isPublic;
      folder.statusId = statusId ?? folder.statusId;
      await folder.save();

      res.status(200).json({ success: true, folder });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete Folder
export const deleteFolder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const folder = await Folder.findByPk(id);

      if (!folder) {
        return next(new ErrorHandler("Folder not found", 404));
      }

      await folder.destroy();

      res.status(200).json({ success: true, message: "Folder deleted" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
