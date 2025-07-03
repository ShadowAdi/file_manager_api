import express from "express";
import {
  AuthenticatedUser,
  LoginUser,
  RegisterUser,
} from "../controllers/userController.js";
import { CheckAuth } from "../middlewares/AuthCheck.js";

export const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.get("/me", CheckAuth, AuthenticatedUser);