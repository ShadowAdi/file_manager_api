import path from "path";
import { promises as fs } from "fs";

const usersFile = path.resolve("src/data/User.json");
const booksFile = path.resolve("src/data/Book.json");

export async function readUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function createUser(user) {
  const users = await readUsers();
  users.push(user);
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

export async function readBooks() {
  try {
    const data = await fs.readFile(booksFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function writeBooks(books) {
  await fs.writeFile(booksFile, JSON.stringify(books, null, 2));
}

export async function createBook(book) {
  const books = await readBooks();
  books.push(book);
  await writeBooks(books);
}
