import { AppError } from "../utils/AppError.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { logger } from "../utils/logger.js";
import { createBook, readBooks, readUsers, writeBooks } from "../utils/ReadWrite.js";
import { v4 as uuidv4 } from "uuid";

export const CreateBook = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    logger.error(`Failed to get the authenticated user ${user}`);
    console.log(`Failed to get the authenticated user ${user}`);
    return next(
      new AppError(`Failed to get the authenticated user ${user}`, 404)
    );
  }
  const { email, sub } = user;
  if (!sub) {
    logger.error(`Failed to get the authenticated user ${sub}`);
    console.log(`Failed to get the authenticated user ${sub}`);
    return next(
      new AppError(`Failed to get the authenticated user ${sub}`, 404)
    );
  }
  const users = await readUsers();
  const isUserExist = users.find((user) => user.email === email);
  if (!isUserExist) {
    logger.error(`User Not Exist. Email:${email}, password:${password}, `);
    console.log(`User Not Exist.  Email:${email}, password:${password}`);
  }
  if (isUserExist.email !== email) {
    logger.error(`User With email Do Not Exist: ${email}`);
    console.log(`User With email Do Not Exist: ${email}`);
    return next(new AppError(`User With email Do Not Exist: ${email}`, 404));
  }

  const { genre, title, author, publishedYear } = req.body;
  if (!genre || !title || !author || !publishedYear) {
    logger.error(
      `Missing fields: genre=${genre}, title=${title}, author=${author} and publish year:${publishedYear}`
    );
    return next(
      new AppError(
        `Missing fields: genre=${genre}, title=${title}, author=${author} and publish year:${publishedYear}`,
        400
      )
    );
  }
  const books = await readBooks();
  const isBookExist = books.find((book) => book.title === title);

  if (isBookExist) {
    logger.error(`Book already exists with title: ${title}`);
    return next(new AppError(`Book already exists with title: ${title}`, 409));
  }

  const newBook = {
    id: uuidv4(),
    title,
    author,
    genre,
    publishedYear: Number(publishedYear),
    userId: user.sub,
  };
  await createBook(newBook);
  logger.info(`Book created: title=${title}, by user=${user.email}`);
  return res.status(201).json({
    success: true,
    message: "Book created successfully",
    book: newBook,
  });
});

export const GetAllBooks = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user || !user.sub || !user.email) {
    logger.error(`Failed to get authenticated user: ${JSON.stringify(user)}`);
    return next(new AppError("Authentication failed", 401));
  }

  const users = await readUsers();
  const isUserExist = users.find((u) => u.email === user.email);
  if (!isUserExist) {
    logger.error(`User not found: email=${user.email}`);
    return next(new AppError(`User not found`, 404));
  }
  const books = await readBooks();

  const genreFilter = req.query.genre;
  const authorFilter = req.query.author;
  const yearFilter = req.query.publishedYear;

  let filteredBooks = books;

  if (genreFilter) {
    filteredBooks = filteredBooks.filter(
      (book) => (book.genre || "").toLowerCase() === genreFilter.toLowerCase()
    );
  }

  if (authorFilter) {
    filteredBooks = filteredBooks.filter(
      (book) => (book.author || "").toLowerCase() === authorFilter.toLowerCase()
    );
  }

  if (yearFilter) {
    filteredBooks = filteredBooks.filter(
      (book) => String(book.publishedYear) === String(yearFilter)
    );
  }

  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || filteredBooks.length;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  logger.info(
    `User ${user.email} fetched books with filters: genre=${
      genreFilter || "all"
    }, author=${authorFilter || "all"}, publishedYear=${
      yearFilter || "all"
    }, page=${page}, limit=${limit}`
  );

  return res.status(200).json({
    success: true,
    total: filteredBooks.length,
    page,
    limit,
    count: paginatedBooks.length,
    books: paginatedBooks,
  });
});

export const GetBookById = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user || !user.sub || !user.email) {
    logger.error(`Failed to get authenticated user: ${JSON.stringify(user)}`);
    return next(new AppError("Authentication failed", 401));
  }

  const users = await readUsers();
  const isUserExist = users.find((u) => u.email === user.email);
  if (!isUserExist) {
    logger.error(`User not found: email=${user.email}`);
    return next(new AppError(`User not found`, 404));
  }

  const bookId = req.params.id;
  const books = await readBooks();
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    logger.error(`Book not found with id: ${bookId}`);
    return next(new AppError(`Book not found with id: ${bookId}`, 404));
  }

  logger.info(`User ${user.email} fetched book with id=${bookId}`);

  return res.status(200).json({
    success: true,
    book,
  });
});

export const UpdateBook = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  const bookId = req.params.id;
  const { title, author, genre, publishedYear } = req.body;

  if (!user || !user.sub || !user.email) {
    logger.error(`Failed to get authenticated user`);
    return next(new AppError("Authentication failed", 401));
  }

  const users = await readUsers();
  const isUserExist = users.find((u) => u.email === user.email);
  if (!isUserExist) {
    logger.error(`User not found: email=${user.email}`);
    return next(new AppError(`User not found`, 404));
  }

  const books = await readBooks();
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    logger.error(`Book not found: id=${bookId}`);
    return next(new AppError(`Book not found`, 404));
  }

  const book = books[bookIndex];

  if (book.userId !== user.sub) {
    logger.error(`User ${user.email} not allowed to update this book`);
    return next(
      new AppError(`You are not authorized to update this book`, 403)
    );
  }

  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (publishedYear) book.publishedYear = Number(publishedYear);

  books[bookIndex] = book;
  await writeBooks(books);

  logger.info(`User ${user.email} updated book id=${bookId}`);
  return res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});

export const DeleteBook = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  const bookId = req.params.id;

  if (!user || !user.sub || !user.email) {
    logger.error(`Failed to get authenticated user`);
    return next(new AppError("Authentication failed", 401));
  }

  const users = await readUsers();
  const isUserExist = users.find((u) => u.email === user.email);
  if (!isUserExist) {
    logger.error(`User not found: email=${user.email}`);
    return next(new AppError(`User not found`, 404));
  }

  const books = await readBooks();
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    logger.error(`Book not found: id=${bookId}`);
    return next(new AppError(`Book not found`, 404));
  }

  const book = books[bookIndex];

  if (book.userId !== user.sub) {
    logger.error(`User ${user.email} not allowed to delete this book`);
    return next(
      new AppError(`You are not authorized to delete this book`, 403)
    );
  }

  books.splice(bookIndex, 1);
  await writeBooks(books);

  logger.info(`User ${user.email} deleted book id=${bookId}`);
  return res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
