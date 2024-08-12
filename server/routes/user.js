import express from "express";
import { asyncHandler } from "../utils/asyncErrorHandler.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send({ message: "user router" });
});

export default userRouter;
