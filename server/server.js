// server/server.js

import express from "express";
import path from "path";
import next from "next";
import tasks from "./data/mock.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

mongoose
  .connect(process.env.NEXT_PUBLIC_DATABASE_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  /* 쿼리 스트링 */
  server.get("/api/task", (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count);

    if (sort || count) {
      const compareFn =
        sort === "oldest"
          ? (a, b) => a.createdAt - b.createdAt // 오래된 순
          : (a, b) => b.createdAt - a.createdAt; // 최신 순

      let newTasks = tasks.sort(compareFn);

      // 정렬 후 개수 처리함. count 값이 있을 경우에는.
      if (count) {
        newTasks = newTasks.slice(0, count);
      }
      res.send(newTasks);
    } else {
      res.send(tasks);
    }
  });

  /* 다이나믹 URL */
  server.get("/api/task/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "cannot find given id" });
    }
  });

  /* POST 요청 - DB 연결 전 */
  server.post("/api/task", (req, res) => {
    const newContent = req.body;
    const ids = tasks.map((task) => task.id);
    newContent.id = Math.max(...ids) + 1;
    newContent.isComplete = false;
    newContent.createdAt = new Date();
    newContent.updatedAt = new Date();

    tasks.push(newContent);
    res.status(201).send(newContent);
  });

  /* PATCH 요청 - DB 연결 전 */
  server.patch("/api/task/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      task.updatedAt = new Date();
      res.send(task);
    } else {
      res.status(404).send({ message: "cannot find given id" });
    }
  });

  server.delete("/api/task/:id", (req, res) => {
    const id = Number(req.params.id);
    const idx = tasks.findIndex((task) => task.id === id);
    if (idx >= 0) {
      tasks.splice(idx, 1);
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "cannot find given id" });
    }
  });

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
