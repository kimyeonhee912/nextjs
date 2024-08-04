// server/server.js
const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // API 라우트 설정
  server.get("/api/hello", (req, res) => {
    console.log("Received request for /api/hello");
    res.json({ message: "Hello from Express!" });
  });
  // Next.js 요청 핸들러
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
