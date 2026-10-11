import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import MongoDBStoreFactory from "connect-mongodb-session";

import connectDb from "./DataBase/Connect.js";

import { ProductRouter } from "./routes/Products/Products.js";
import { AdminRouter } from "./routes/Admins/Admin.js";

import { errormidleware } from "./MiddleWare/ErrorMiddleware.js";
import cookieParser from "cookie-parser";


const app = express();

console.log("TEST ROUTE REGISTERED");
app.use(express.json())
app.use(cookieParser())
// =====================================================
// MongoDB Session Store
// =====================================================

const MongoDBStore = MongoDBStoreFactory(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  databaseName: "Panel",
  collection: "sessions",
});


// =====================================================
// Session
// =====================================================

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,

    resave: false,
    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);
// =====================================================
// Upload Images
// =====================================================



// =====================================================
// Middlewares
// =====================================================

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3003",
    credentials: true,
  })
);



// =====================================================
// Routers
// =====================================================

app.use("/Products", ProductRouter);

app.use("/Admin", AdminRouter);



// =====================================================
// Database
// =====================================================

await connectDb();


// =====================================================
// Error Middleware
// =====================================================

app.use(errormidleware);


// =====================================================
// Server
// =====================================================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});