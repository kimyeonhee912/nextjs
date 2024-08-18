import express from "express";
import { asyncHandler } from "../utils/asyncErrorHandler.js";

const userRouter = express.Router();

function useNext(req, res, next) {
  console.log("---use 메소드 사용----");
  res.json({ message: "use" });
  next();
}

function greeting(req, res, next) {
  console.log("첨 사용");
  res.json({ message: "첨 사용해봄" });
}

userRouter.get("/test", useNext, greeting);

/* use - 첫번째 파라미터 생략 가능 / all */
userRouter.use("/hello", useNext);
userRouter.all("/hello/hi", (req, res, next) => {
  console.log("all 메소드 사용");
  next();
});
userRouter.get("/hello/hi", (req, res) => {
  console.log("get 메소드 사용");
});

userRouter.post("/hello/hi", (req, res) => {
  console.log("post 메소드 사용");
});

/* 미들웨어로 req, res 다루기 */
function authentication(req, res, next) {
  req.user = "sungchan";
  next();
}

userRouter.get("/me", authentication, (req, res, next) => {
  console.log(req.user);
  res.json({ user: req.user });
});

/* 에러 처리하기 */
function error(req, res, next) {
  next(new Error("alert error"));
  next();
}

function ok(req, res, next) {
  res.json({ message: "good response" });
}

userRouter.get("/error", error, ok);
userRouter.use((error, req, res, next) => {
  console.log(error);
  res.json({ message: "error handler" });
});

userRouter.use(express.urlencoded({ extended: true }));
userRouter.post("/middleware", (req, res, next) => {
  console.log(req.body);
  res.json({ message: "user 추가" });
});

export default userRouter;
