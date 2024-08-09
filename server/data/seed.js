import mongoose from "mongoose";
import data from "./mock.js";
import Task from "../models/tasks.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();
