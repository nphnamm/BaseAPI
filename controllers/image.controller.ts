import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const Set = db.Set;

interface CustomRequest extends Request {
    user?: any;
}
// Create Folder
export const searchImage = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                keyword
            } = req.body;
            const userId = (req as CustomRequest).user.id;
            const url = `https://api.unsplash.com/search/photos`;
            const response = await axios.get(url, {
                params: { query: keyword, per_page: 10 },
                headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
            });
            // console.log(response.data.results);

            const images = response.data.results.map((image: any) => (
                {
                    id: image.id,
                    imageUrl: image.urls.small,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ));

            res.status(201).json({
                success: true,
                images: images,
            });
        } catch (error: any) {
            console.log(error);
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
