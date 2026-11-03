import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = function (password) {
  if (/^\$2[aby]\$\d{2}\$/.test(this.password)) {
    return bcrypt.compare(password, this.password);
  }

  const storedPassword = Buffer.from(this.password);
  const candidatePassword = Buffer.from(password);
  return (
    storedPassword.length === candidatePassword.length &&
    timingSafeEqual(storedPassword, candidatePassword)
  );
};

const User = mongoose.model("User", userSchema);

export default User;
