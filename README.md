# 📚 Bookstore REST API with File-Based Persistence and Authentication

A simple RESTful API built with **Node.js** and **Express** for managing a bookstore.  
Supports CRUD operations on books, user authentication with JWT, file-based data persistence, and includes custom middleware for logging and error handling.

> ✅ Built using: Node.js, Express, JWT, bcrypt, cors  
> 🪵 Custom logger middleware & global try-catch error handler  
> 📝 Data stored in JSON files (`users.json`, `books.json`) using `fs.promises`

---

## ✨ Features

- User authentication (register, login, get current user)
- Token-based auth with JWT
- CRUD operations on books (create, read, update, delete)
- Filter & paginate books:
  - `?genre=Fantasy`
  - `?author=John`
  - `?publishedYear=2023`
  - `?page=1&limit=10`
- File-based persistence (no database)
- Middleware:
  - Custom logger for request info & errors
  - Centralized error handling
- UUID for unique IDs (`uuid` package)

---

## 🚀 Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/ShadowAdi/file_manager_api.git
cd file_manager_api
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**  
*(example)*
```
PORT=3000
JWT_SECRET=your_secret_key
```

4. **Start the server**
```bash
npm start
```

Server runs at:  
```
http://localhost:3000
```

---

## 🔒 **Authentication**

- Token required for all `/api/books` endpoints
- Get token by:
  - Register: `POST /api/user/register`
  - Login: `POST /api/user/login` → returns `token`
- Pass token as header:
```
Authorization: Bearer <token>
```

---

## 📌 **API Documentation**

> Tested with Thunder Client (VSCode) — you can also use Postman or curl.

### 🧑‍💻 Users

#### ✅ Register
```
POST /api/user/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "name": "John"
}
```

#### 🔑 Login
```
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "<JWT token>",
  "user": { ... }
}
```

#### 🙋‍♂️ Get Current User
```
GET /api/user/me
Authorization: Bearer <token>
```

---

### 📚 Books

All require:  
```
Authorization: Bearer <token>
```

#### 📖 Create a book
```
POST /api/books/create-book
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fantasy",
  "publishedYear": 2022
}
```

#### 📚 Get all books
```
GET /api/books
```

Optional filters:
- `/api/books?genre=Fantasy`
- `/api/books?author=John`
- `/api/books?publishedYear=2022`
- `/api/books?page=1&limit=5`

#### 📗 Get book by ID
```
GET /api/books/book/:id
```

#### ✏ Update book
```
PATCH /api/books/book/:id
Content-Type: application/json

{
  "title": "Updated title"
}
```

#### 🗑 Delete book
```
DELETE /api/books/book/:id
```

---

## 🛠 **Tech & Packages**

- express
- cors
- bcrypt
- jsonwebtoken
- uuid
- fs.promises (file-based persistence)
- Custom logger middleware using winston
- Centralized error middleware

---

## ✅ **Extra**
- No DB: books & users stored in `src/data/Book.json` and `src/data/User.json`
- Only book creator can update/delete their books
- Custom `CustomTryCatch` helper for async routes
- Clean, modular code: routes, controllers, utils, middlewares

---

## 🐙 **Repository**
[GitHub → ShadowAdi/file_manager_api](https://github.com/ShadowAdi/file_manager_api)

---
