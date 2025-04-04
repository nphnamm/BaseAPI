require("dotenv");
import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  user?: any;
}
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { json } from "stream/consumers";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../utils/sendMail";
import user, { UserAttributes } from "../models/user";
const bcrypt = require("bcrypt");
const saltRounds = 10;
import db from "../models/index";
import { getUserById } from "../services/user.service";
const User = db.User;
// console.log("User:", User); // Thêm dòng này để kiểm tra đối tượng User
// register user
interface IRegistrationBody {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  statusId: number;
  avatar?: string;
}

interface IForgotBody {
  email: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
  // console.log("env:", process.env.ACTIVATION_SECRET);
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      avatar,
      statusId,
    } = req.body;
    if (email === "" && phoneNumber === "") {
      return next(
        new ErrorHandler(
          "Please provide one of both to activate your account",
          400
        )
      );
    }
    if (email === "" || password === "" || username === "") {
      return next(new ErrorHandler("Please provide all fields", 400));
    }
    // console.log("email:", email);
    // console.log("user...", User); // Thêm dòng này để kiểm tra đối tượng User

    const userAlready = await User.findOne({ where: { email } });
    if (userAlready) {
      return next(new ErrorHandler("Email already exists", 400));
    }
    // Check if the phoneNumber already exists
    if (phoneNumber) {
      const userAlreadyByPhoneNumber = await User.findOne({
        where: { phoneNumber },
      });
      if (userAlreadyByPhoneNumber) {
        return next(new ErrorHandler("Phone number already exists", 400));
      }
    }

    // Check if the userName already exists
    if (username) {
      const userAlreadyByUserName = await User.findOne({ where: { username } });
      if (userAlreadyByUserName) {
        return next(new ErrorHandler("Username number already exists", 400));
      }
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo người dùng với mật khẩu đã mã hóa
    const user: IRegistrationBody = {
      username,
      firstName,
      lastName,
      phoneNumber,
      avatar,
      statusId,
      email,
      password: hashedPassword,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = {
      user: {
        name: user.username,
      },
      activationCode,
    };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );
    try {
      sendMail({
        email: user.email,
        subject: "Account Activation",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: "Please check your email to activate your account",
        activationToken: activationToken.token,
      });
    } catch (err) {
      return next(new ErrorHandler(err, 500));
    }
  }
);

// activate   user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      // using jwt to verify and get activation code
      const newUser: { user: UserAttributes; activationCode: string } =
        jwt.verify(
          activation_token,
          process.env.ACTIVATION_SECRET as string
        ) as { user: UserAttributes; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      // console.log(newUser.user);
      const {
        username,
        firstName,
        lastName,
        phoneNumber,
        avatar,
        statusId,
        email,
        password,
      } = newUser.user;

      const user = await User.create({
        id: uuidv4(),
        username: email,
        firstName,
        lastName,
        phoneNumber: Math.floor(100000 + Math.random() * 900000),
        avatar,
        statusId,
        email,
        password,
      });
      res.status(201).json({
        user,
        success: true,
      });
    } catch (error: any) {
      console.log("err", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// login
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (email === "" && password === "") {
      return next(
        new ErrorHandler(
          "Please provide your email and password to login your account",
          400
        )
      );
    }
    // console.log(email, password);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    sendToken(user, 200, res);
  }
);

// get user information

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log((req as CustomRequest).user);
      const userId = (req as CustomRequest).user.id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout

export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = (req as CustomRequest).user.id || "";

      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// forgot password
export const forgotPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user: IForgotBody = {
        email,
      };
      if (!email) {
        return next(new ErrorHandler("Please provide your email", 400));
      }
      const isEmailExist = await User.findOne({ where: { email: email } });

      // console.log(isEmailExist);
      if (!isEmailExist) {
        return next(new ErrorHandler("Account doesn't exist", 400));
      }
      // jwt create code activation
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;
      const data = {
        user: {
          email: user.email,
        },
        activationCode,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/forgot-mail.ejs"),
        data
      );
      try {
        sendMail({
          email: user.email,
          subject: "Activation account",
          template: "forgot-mail.ejs",
          data,
        });
        res.status(201).json({
          succues: true,
          message: `Please check your email: ${user.email} to reset your password!`,
          activationToken: activationToken.token,
          activationCode,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// activation forgot password
interface IForgotPasswordRequest {
  activation_token: string;
  activation_code: string;
  newPassword: string;
}

export const verifyForgotPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code, newPassword } =
        req.body as IForgotPasswordRequest;
      // using jwt to verify and get activation code
      const newUser: { user: UserAttributes; activationCode: string } =
        jwt.verify(
          activation_token,
          process.env.ACTIVATION_SECRET as string
        ) as { user: UserAttributes; activationCode: string };
      // console.log(newUser);
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { email } = newUser.user;
      const existUser = await await User.findOne({ where: { email: email } });
      if (existUser) {
        const isMatch = await bcrypt.compare(existUser.password, newPassword);

        if (isMatch) {
          return next(
            new ErrorHandler(
              "New password mustn't match with old password",
              400
            )
          );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update(
          { password: hashedPassword },
          { where: { id: existUser.id } }
        );
        existUser.password = hashedPassword;
        await redis.set(existUser.id, JSON.stringify(existUser));

        res.status(200).json({
          success: true,
          message: "Password updated successfully",
        });
      }
      // res.status(201).json({
      //     existUser,
      //     success: true
      // })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// update information
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = (req as CustomRequest).user.id;

      const user = await User.findByPk(userId);
      // console.log("user", user);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.username = name || user.name;
      user.email = email || user.email;

      await user.save();

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// authentication
// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resource", 400)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      (req as CustomRequest).user = user;
      await redis.set(user.id, JSON.stringify(user), "EX", 604800); //7days

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      // res.status(200).json({
      //     status: "success",
      //     accessToken,
      //     refreshToken
      // })
      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const refreshToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy refresh token từ cookie
      const refresh_token = req.cookies.refresh_token as string;

      // Xác thực refresh token
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Invalid refresh token", 400));
      }

      // Lấy thông tin user từ redis
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Session expired. Please login again", 400)
        );
      }

      const user = JSON.parse(session);

      // Tạo access token mới
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      // Tạo refresh token mới
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      // Cập nhật session trong redis (7 ngày)
      await redis.set(user._id, JSON.stringify(user), "EX", 604800);

      // Set cookies mới
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      // Trả về response
      res.status(200).json({
        status: "success",
        accessToken,
        refreshToken,
        message: "Token refreshed successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// socialAuth

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
  provider: string;
}
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;

      const user = await User.create({
        firstName: name,
        avatar,
        email,
      });
      res.status(201).json({
        user,
        success: true,
      });
    } catch (error: any) {
      console.log("err", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      const userId = (req as CustomRequest).user.id;

      let userJson = await redis.get(userId);
      let user;

      if (userJson) {
        const userData = JSON.parse(userJson);
        user = await User.findOne({
          where: { id: userData.id },
          attributes: ["id", "password"],
        });
      } else {
        user = await User.findOne({
          where: { id: userId },
          attributes: ["id", "password"],
        });
      }

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if old password matches
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return next(new ErrorHandler("Incorrect old password", 400));
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Use correct Sequelize update syntax
      await User.update(
        { password: hashedPassword },
        { where: { id: user.id } }
      );

      // Update cache in Redis
      user.password = hashedPassword;
      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// update profile picture
// delete user
// me
