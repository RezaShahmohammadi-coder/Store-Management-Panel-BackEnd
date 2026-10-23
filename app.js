
import express from "express";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import MongoDBStoreFactory from "connect-mongodb-session";
import cookieParser from "cookie-parser";

import { ProductRouter } from "./routes/Products/Products.js";
import { AdminRouter } from "./routes/Admins/Admin.js";

import { errormidleware } from "./MiddleWare/ErrorMiddleware.js";
import { tracker } from "./MiddleWare/Tracker.MiddleWare.js";

const app = express();

// 1. درخواست‌های JSON
app.use(express.json());

// 2. خواندن Cookieها
app.use(cookieParser());

// 3. تنظیم CORS
app.use(
  cors({
    origin: "http://localhost:3003",
    credentials: true,
  })
);

// 4. ساخت MongoDB Session Store
const MongoDBStore = MongoDBStoreFactory(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  databaseName: "Panel",
  collection: "sessions",
});

// 5. تنظیم Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);

// 6. محدودیت درخواست‌ها
app.use(tracker);

// 7. Routerها
app.use("/Products", ProductRouter);
app.use("/Admin", AdminRouter);

// 8. مدیریت خطا
app.use(errormidleware);

export default app;
