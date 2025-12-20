import { Router } from "express";
import Tag from "../models/Tag.js";


const router = Router();

router.get("/", async (_req, res) => {
  const tags = await Tag.find();
  res.json(tags);
});

export default router;
