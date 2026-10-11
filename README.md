# [Project Name]

An admin panel backend built as a **REST API** with **Node.js** and **MongoDB**, featuring **JWT** authentication and per-user **role-based access control**.

## ✨ Features

- Product management: create, update, and delete (full CRUD)
- Create new admins with a custom username and password
- JWT-based authentication
- Role-Based Access Control (RBAC): permissions are enforced per admin
- Request validation before data reaches the controllers
- MVC architecture with separate controllers, routers, and middlewares

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js |
| Framework | [Express] |
| Database | MongoDB ([Mongoose]) |
| Authentication | JSON Web Token (JWT) |
| Validation | [Joi / express-validator] |
| Password hashing | [bcrypt / bcryptjs] |

## 🏗 Architecture (MVC)

```
[project-name]/
├── controllers/     # Request handling logic
├── models/          # MongoDB schemas
├── routes/          # Route definitions
├── middlewares/     # Auth, permissions, validation
├── app.js           # App entry point
└── package.json
```

### Request Flow

```
Request → Router → Auth Middleware → Permission Middleware
        → Validation Middleware → Controller → Model → Response
```

## 🔐 Authentication & Authorization

1. An admin logs in with a username and password.
2. If the credentials are valid, the server issues a **JWT**.
3. The client sends the token with every request:

```
Authorization: Bearer <token>
```

4. The authentication middleware verifies the token, then the permission middleware checks whether this admin is allowed to perform the requested action.

| Role | Permissions |
|---|---|
| [Role 1, e.g. Super Admin] | [e.g. Everything, including creating admins] |
| [Role 2, e.g. Admin] | [e.g. Manage products] |

## 📡 API Endpoints

> Replace these with your project's actual routes.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/[auth/login]` | Log in and receive a token |

### Admins

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/[admin/admins]` | Create a new admin | [Allowed role] |

### Products

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/[products]` | List products | [Allowed role] |
| POST | `/[products]` | Create a product | [Allowed role] |
| PUT | `/[products/:id]` | Update a product | [Allowed role] |
| DELETE | `/[products/:id]` | Delete a product | [Allowed role] |

## 🚀 Getting Started

### Prerequisites

- Node.js [v18 or higher]
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/[username]/[repo].git
cd [repo]
npm install
```

Create a `.env` file in the project root (see `.env.example`):

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/[db-name]
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1h
```

Run the app:

```bash
npm run dev     # development
npm start       # production
```

##  Input Validation

All user input (username, password, product details, etc.) is validated before reaching the controller. Invalid requests receive an appropriate error response.

## 📝 Security Notes

- Passwords are stored hashed, never as plain text.
- Sensitive values (`JWT_SECRET`, `MONGO_URI`) live only in `.env` and are never committed to Git.

## 👤 Reza.shahmohamaadi

