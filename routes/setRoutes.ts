const express = require("express");

import { createSet, getAllSets, getSetByFolderId, getSetByUserId, updateSet } from "../controllers/set.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create-set", isAuthenticated,createSet);
router.put("/update-set/:id", isAuthenticated,updateSet);

router.get("/get-all-sets", isAuthenticated,getAllSets);
router.get("/get-sets-by-folderId/:id", isAuthenticated,getSetByFolderId);
router.get("/get-sets-by-userId",isAuthenticated,getSetByUserId);


export default router;
