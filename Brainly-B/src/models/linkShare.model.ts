import mongoose, { Schema, model } from "mongoose";
import User from "./user.model";

const linkSchema = new Schema({
  hash: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true,
    unique: true,
  },
});

export const Link = model("Link", linkSchema);