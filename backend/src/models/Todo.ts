import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  userId: mongoose.Types.ObjectId;
  tag?: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: String,
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tag: { type: String, required: true}
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
