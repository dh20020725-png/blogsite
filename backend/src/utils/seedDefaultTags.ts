import Tag from "../models/Tag.js";
import { DEFAULT_TAGS } from "../constants/defaultTags.js";

export async function seedDefaultTags() {
  for (const tag of DEFAULT_TAGS) {
    await Tag.updateOne(
      { name: tag },
      { name: tag },
      { upsert: true }
    );
  }
}
