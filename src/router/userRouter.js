import express from "express";
import { CheckAuth } from "../middlewares/AuthCheck.js";
import { AuthenticatedUser, LoginUser, RegisterUser } from "../controllers/UserController.js";

export const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.get("/me", CheckAuth, AuthenticatedUser);