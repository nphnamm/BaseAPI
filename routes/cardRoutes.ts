const express = require("express");

import { createCard, getAllCards, getCardBySetId, updateCard} from "../controllers/card.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create-card", isAuthenticated,createCard);
router.get("/get-all-cards", isAuthenticated,getAllCards);
router.get("/get-all-card-by-setId/:id", isAuthenticated,getCardBySetId);
router.put("/update-card/:id",isAuthenticated,updateCard);


export default router;
