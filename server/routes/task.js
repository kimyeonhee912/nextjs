import express from "express";
import mongoose from "mongoose";
import Task from "../models/tasks.js";

const TaskRouter = express.Router();

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id" });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/* GET API - 전체 or 쿼리 */
TaskRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

/* GET API - 아이디 */
TaskRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
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

/* POST API */
TaskRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const newContent = await Task.create(req.body);
    res.status(201).send(newContent);
  })
);

/* PATCH API  */
TaskRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
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
