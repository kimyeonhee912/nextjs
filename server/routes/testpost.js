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

/* GET API */
testRouter.get("/mysql-data", async (req, res) => {
  console.log("GET 요청");

  try {
    // MySQL 데이터베이스에서 데이터를 조회합니다.
    const [rows] = await mysqlConnection.execute("SELECT * FROM test_task");

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("MySQL select error:", error);
    res
      .status(500)
      .json({ success: false, error: "Database retrieval failed" });
  }
});

/* DELETE API */
testRouter.delete("/mysql-data/:id", async (req, res) => {
  console.log("DELETE 요청", req.params.id);

  try {
    // MySQL 데이터베이스에서 특정 ID의 데이터를 삭제합니다.
    const [result] = await mysqlConnection.execute(
      "DELETE FROM test_task WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, error: "Data not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Data deleted successfully" });
    }
  } catch (error) {
    console.error("MySQL delete error:", error);
    res.status(500).json({ success: false, error: "Database deletion failed" });
  }
});

export default testRouter;
