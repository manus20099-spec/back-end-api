import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.js";

const { BOOTSTRAP_USER_NAME, BOOTSTRAP_USER_AGE, BOOTSTRAP_USER_EMAIL, BOOTSTRAP_USER_PASSWORD } =
  process.env;

if (
  !BOOTSTRAP_USER_NAME ||
  !BOOTSTRAP_USER_AGE ||
  !BOOTSTRAP_USER_EMAIL ||
  !BOOTSTRAP_USER_PASSWORD
) {
  throw new Error("User details and password must be provided through the local setup command.");
}

if (!process.env.MONGODBURI) {
  throw new Error("MONGODBURI is not set.");
}

await mongoose.connect(process.env.MONGODBURI);
try {
  const user = await User.create({
    name: BOOTSTRAP_USER_NAME,
    age: Number(BOOTSTRAP_USER_AGE),
    email: BOOTSTRAP_USER_EMAIL,
    password: BOOTSTRAP_USER_PASSWORD,
  });
  console.log(`Created user ${user.email} with id ${user.id}.`);
} catch (error) {
  if (error.code === 11000) {
    throw new Error("A user with this email already exists.");
  }
  throw error;
} finally {
  await mongoose.disconnect();
}
