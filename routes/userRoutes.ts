const express = require("express");
import {
  activateUser,
  forgotPassword,
  getUserInfo,
  loginUser,
  logoutUser,
  refreshToken,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateUserInfo,
  verifyForgotPassword,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/sign-up", registrationUser);
router.post("/activation", activateUser);
router.post("/login", loginUser);
router.get("/logout", updateAccessToken, isAuthenticated, logoutUser);
router.get("/me", updateAccessToken, isAuthenticated, getUserInfo);
router.get("/refresh", refreshToken);

router.put(
  "/update-user-info",
  updateAccessToken,
  isAuthenticated,
  updateUserInfo
);
router.put(
  "/update-user-password",
  updateAccessToken,
  isAuthenticated,
  updatePassword
);
router.post("/social-auth", socialAuth);

router.post("/forgot-password", forgotPassword);

router.post("/verify-forgot-password", verifyForgotPassword);
export default router;
