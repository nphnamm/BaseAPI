const express = require("express");

import { RestartSession, UpdateProgress } from "../controllers/userProgresses.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/update-progress", isAuthenticated,UpdateProgress);
router.post("/restart-session", isAuthenticated,RestartSession);


export default router;
