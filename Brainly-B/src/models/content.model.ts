import mongoose, { model, Schema } from "mongoose";

const contentSchema = new Schema({
  title: String,
  link: {type: String, required: true},
  type: {type: String, required: true},
  description: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const Content = model("Content", contentSchema);