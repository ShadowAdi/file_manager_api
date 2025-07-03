import express from "express";
import { CheckAuth } from "../middlewares/AuthCheck.js";
import {
  CreateBook,
  DeleteBook,
  GetAllBooks,
  GetBookById,
  UpdateBook,
} from "../controllers/BookController.js";

export const bookRouter = express.Router();

bookRouter.post("/create-book", CheckAuth, CreateBook);
bookRouter.get("/", CheckAuth, GetAllBooks);
bookRouter.get("/book/:id", CheckAuth, GetBookById);
bookRouter.patch("/book/:id", CheckAuth, UpdateBook);
bookRouter.delete("/book/:id", CheckAuth, DeleteBook);
