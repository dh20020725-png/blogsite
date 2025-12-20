import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import todoRoutes from "./routes/todos.js";
import tagRoutes from "./routes/tags.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";


async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB connected");

    app.use("/api/todos", todoRoutes);
    app.use("/api/tags", tagRoutes);
    app.use("/api/auth", authRoutes);

    app.listen(4000, () => {
      console.log(" Server running on http://localhost:4000");
    });
  } catch (err) {
    console.error(" MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();
