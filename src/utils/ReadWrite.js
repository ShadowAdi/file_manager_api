import path from "path";
import { promises as fs } from "fs";

const usersFile = path.resolve("src/data/User.json");
const booksFile = path.resolve("src/data/Book.json");

export async function readUsers() {
  const data = await fs.readFile(usersFile);
  return JSON.parse(data);
}

export async function createUser(user) {
  const createUser=await fs.writeFile(usersFile, JSON.stringify(user, null, 2));
  return createUser
}


export async function readBooks() {
  const data = await fs.readFile(booksFile);
  return JSON.parse(data);
}

export async function createBook(book) {
  await fs.writeFile(booksFile, JSON.stringify(book, null, 2));
}


