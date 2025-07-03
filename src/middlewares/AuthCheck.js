import mongoose from "mongoose";
import { JWT_SECRET_KEY } from "../envs/index.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken";

export const CheckAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const message = `Token not provided or invalid format. Header: ${authHeader}`;
      logger.error(message);
      return next(new AppError(message, 401));
    }

    const token = authHeader.split(" ")[1];
    const Jwt_Secret = JWT_SECRET_KEY;

    if (!Jwt_Secret) {
      logger.error("JWT secret key not found.");
      return next(new AppError("Internal server error", 500));
    }

    const decoded = jwt.verify(token, Jwt_Secret);
    if (!mongoose.Types.ObjectId.isValid(decoded.sub)) {
      logger.error(`Invalid user ID in token: ${decoded.sub}`);
      throw new Error("Invalid user id");
    }
    req.user = decoded;

    next();
  } catch (error) {
    logger.error("Error in checking auth: " + error.message);
    return next(new AppError("Unauthorized access", 401));
  }
};