import express from "express";
import mysql from "mysql2/promise"; //mysql 연결
const testPost = express.Router();

// MySQL 연결 설정
const mysqlConnection = await mysql.createConnection({
  host: process.env.NEXT_PUBLIC_MYSQL_HOST,
  user: process.env.NEXT_PUBLIC_MYSQL_USER,
  password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
});

mysqlConnection
  .connect()
  .then(() => console.log("Connected to MySQL"))
  .catch((err) => console.error("MySQL connection error:", err));

/* POST API */
testPost.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log("POST 요청", req.body);

    const newContent = await Task.create(req.body);
    res.status(201).send(newContent);
  })
);
