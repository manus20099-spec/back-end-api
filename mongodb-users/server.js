import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import User from "./models/user.js";

const app = express();
const port = Number(process.env.PORT) || 5001;
const mongoUri = process.env.MONGODBURI;

app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MongoDB Users API", users: "/users" });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);

  res.status(500).json({ error: "Internal server error" });
});

if (!mongoUri) {
  console.error("MONGODBURI is not set. Add it to mongodb-users/.env before starting.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(mongoUri);
    await User.createCollection();
    console.log("MongoDB connected; users collection is ready.");

    app.listen(port, () => {
      console.log(`Users API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB or create the users collection:", error.message);
    process.exitCode = 1;
    await mongoose.disconnect();
  }
}
