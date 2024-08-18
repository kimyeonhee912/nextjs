import express from "express";
import mongoose from "mongoose";
import Task from "../models/tasks.js";
import { asyncHandler } from "../utils/asyncErrorHandler.js";

const TaskRouter = express.Router();

/* GET API - 전체 or 쿼리 */
TaskRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    console.log("GET 요청", req.query);

    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

/* POST API */
TaskRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log("POST 요청", req.body);

    const newContent = await Task.create(req.body);
    res.status(201).send(newContent);
  })
);

/* GET API - 아이디 */
TaskRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log("GET 요청 - 아이디");

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
  })
);

/* PATCH API  */
TaskRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log("PATCH 요청");

    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: "cannot find given id" });
    }
  })
);

/* DELETE API  */
TaskRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log("DELETE 요청");

    const id = req.params.id;
    const idx = await Task.findByIdAndDelete(id);
    if (idx) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "cannot find given id" });
    }
  })
);

export default TaskRouter;
