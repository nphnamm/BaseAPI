import { createConversation, getConversationDetails, getConversations, resumeConversation } from "../controllers/conversation.controller";
import { isAuthenticated } from "../middleware/auth";

const express = require("express");


const router = express.Router();

router.post("/start", isAuthenticated,createConversation);
router.post("/resume", isAuthenticated,resumeConversation);
router.get("/conversation",isAuthenticated,getConversations)
router.patch("/conversation-detail",isAuthenticated,getConversationDetails)

export default router;
