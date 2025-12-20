import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "./models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todo-dev";

async function connectDb() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}

export async function seedDevUser() {
  try {
    const existing = await User.findOne({ email: "dev@example.com" });
    if (existing) {
      console.log("Dev user already exists");
      return;
    }

    await User.create({
      name: "Dev",
      email: "dev@example.com",
      password: "password123",
    });

    console.log("Dev user seeded successfully");
  } catch (err) {
    console.error("Error seeding dev user:", err);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      await connectDb();
      await seedDevUser();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error("Error seeding dev user:", err);
      process.exit(1);
    }
  })();
}