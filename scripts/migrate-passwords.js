import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.js";

if (!process.env.MONGODBURI) {
  throw new Error("MONGODBURI is not set.");
}

await mongoose.connect(process.env.MONGODBURI);

let migrated = 0;
try {
  const users = User.find().select("+password").cursor();
  for await (const user of users) {
    if (/^\$2[aby]\$\d{2}\$/.test(user.password)) continue;

    const hashedPassword = await bcrypt.hash(user.password, 12);
    const result = await User.updateOne(
      { _id: user._id, password: user.password },
      { $set: { password: hashedPassword } },
    );
    migrated += result.modifiedCount;
  }
  console.log(`Migrated ${migrated} plain-text password(s).`);
} finally {
  await mongoose.disconnect();
}
