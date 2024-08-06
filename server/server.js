// server/server.js

import express from "express";
import path from "path";
import next from "next";
import task from "./data/mock.js";

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  /* 쿼리 스트링 */
  server.get("/api/task", (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count);

    if (sort || count) {
      const compareFn =
        sort === "oldest"
          ? (a, b) => a.createdAt - b.createdAt // 오래된 순
          : (a, b) => b.createdAt - a.createdAt; // 최신 순

      let newTasks = task.sort(compareFn);

      // 정렬 후 개수 처리함. count 값이 있을 경우에는.
      if (count) {
        newTasks = newTasks.slice(0, count);
      }
      res.send(newTasks);
    } else {
      res.send(task);
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
