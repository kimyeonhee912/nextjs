import express from "express";
import mysql from "mysql2/promise"; //mysql 연결
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const testRouter = express.Router();

// MySQL 연결 설정
let mysqlConnection;

(async () => {
  mysqlConnection = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
  });

  try {
    await mysqlConnection.connect();
    console.log("Connected to MySQL");
  } catch (err) {
    console.error("MySQL connection error:", err);
  }
})();

/* POST API */
testRouter.post("/mysql-data", async (req, res) => {
  console.log("POST 요청", req.body);

  try {
    const result = await mysqlConnection.execute(
      "INSERT INTO test_task (content) VALUES (?)",
      [req.body.content] // 여기서 req.body.content를 배열로 전달
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("MySQL insert error:", error);
    res
      .status(500)
      .json({ success: false, error: "Database insertion failed" });
  }
});

export default testRouter;
