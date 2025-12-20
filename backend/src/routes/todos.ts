import type { Request, Response } from "express";
import { Router } from "express";
import Todo from "../models/Todo.js";
import User from "../models/User.js";

const router = Router();

/**
 * GET ALL
 */
router.get("/", async (_req: Request, res: Response) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

/**
 * CREATE
 */
router.post("/", async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, tag } = req.body;

  if (!title || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let user = await User.findOne({ email: "dev@user.com" });

  if (!user) {
    user = await User.create({
      email: "dev@user.com",
      password: "dev"
    });
  }

  const todo = await Todo.create({
    title,
    description,
    startDate,
    endDate,
    tag,
    userId: user._id
  });

  res.status(201).json(todo);
});

/**
 * UPDATE
 */
router.put("/:id", async (req: Request, res: Response) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(todo);
});

/**
 * DELETE
 */
router.delete("/:id", async (req: Request, res: Response) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
