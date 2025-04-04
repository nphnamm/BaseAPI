const express = require("express");

import { searchImage } from "../controllers/image.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/search-image", isAuthenticated,searchImage);


export default router;
