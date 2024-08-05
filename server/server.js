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

  server.get("/api/task", (req, res) => {
    res.send(task);
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
