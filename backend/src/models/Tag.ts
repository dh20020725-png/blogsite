import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true }
});

const Tag = mongoose.model<ITag>("Tag", TagSchema);

export default Tag;
