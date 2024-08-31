// server/server.js

import express from "express";
import next from "next";
import mongoose from "mongoose"; //mongoose 연결
import mysql from "mysql2/promise"; //mysql 연결
import dotenv from "dotenv";
import TaskRouter from "./routes/task.js";
import userRouter from "./routes/user.js";

dotenv.config({ path: ".env.local" });
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

mongoose
  .connect(process.env.NEXT_PUBLIC_DATABASE_URL)
  .then(() => console.log("Connected to DB"));

// MySQL 연결 설정
const mysqlConnection = await mysql.createConnection({
  host: process.env.NEXT_PUBLIC_MYSQL_HOST,
  user: process.env.NEXT_PUBLIC_MYSQL_USER,
  password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
});

mysqlConnection
  .connect()
  .then(() => console.log("Connected to MySQL"))
  .catch((err) => console.error("MySQL connection error:", err));

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // task 라우터 등록
  server.use("/api/task", TaskRouter);
  server.use("/api/user", userRouter);

  // Next.js 페이지 요청 처리
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
