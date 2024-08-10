// server/server.js

import express from "express";
import path from "path";
import next from "next";
import mockTasks from "./data/mock.js";
import Task from "./models/tasks.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

  /* GET API - 전체 or 쿼리 */
  server.get("/api/task", async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  });

  /* GET API - 아이디 */
  server.get("/api/task/:id", async (req, res) => {
    /* mongoDB에서 조회
      1. id: 문자열
      2. 비동기로 데이터 가져옴.
      3. await Task.findById(id)는 쿼리를 리턴함. 즉, 조회(등)한 결과값을 리턴 
      4. findById(id)는 하나만, find()는 여러개를 리턴, findOne(조건)은 조건에 맞는 것의 하나만 리턴
    */
    const id = req.params.id;
    const idIsValid = mongoose.isValidObjectId(id); //true or false

    if (idIsValid) {
      const task = await Task.findById(id);
      if (task) {
        res.send(task);
      } else {
        res.status(404).send({ message: "cannot find given id" });
      }
    } else {
      //false면
      res.status(404).send({ message: "is not valid ID" });
    }
  });

  /* POST API */
  server.post("/api/task", async (req, res) => {
    const newContent = await Task.create(req.body);
    res.status(201).send(newContent);
  });

  /* PATCH API - DB 연결 전 */
  server.patch("/api/task/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = mockTasks.find((task) => task.id === id);
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
    const idx = mockTasks.findIndex((task) => task.id === id);
    if (idx >= 0) {
      mockTasks.splice(idx, 1);
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
