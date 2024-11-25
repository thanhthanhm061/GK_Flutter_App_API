import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // minlength: 6,
    },
    age: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);


userSchema.index({ username: 1, email: 1 });

export default mongoose.model("User", userSchema);
