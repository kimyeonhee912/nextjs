import express from "express";
import { asyncHandler } from "../utils/asyncErrorHandler.js";

const userRouter = express.Router();

function testNext(req, res, next) {
  console.log("next 사용해보기");
  next();
}

function greeting(req, res, next) {
  console.log("첨 사용");
  res.json({ message: "첨 사용해봄" });
}

userRouter.get("/hello", testNext, greeting);

userRouter.get("/", (req, res) => {
  res.send({ message: "user router" });
});

export default userRouter;
