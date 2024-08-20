// server/server.js

import express from "express";
import next from "next";
import mongoose from "mongoose";
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

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.static("uploads"));

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
