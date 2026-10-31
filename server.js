import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import apiRoutes from "./routes/api.routes.js";
import testRoutes from "./routes/test.routes.js";
import userRoutes from "./routes/users.routes.js";
import todoRoutes from "./routes/todos.routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", apiRoutes);
app.use((req, res, next) => {
  if (
    (req.path.startsWith("/user") || req.path.startsWith("/todo")) &&
    mongoose.connection.readyState !== 1
  ) {
    return res.status(503).json({
      error: "Database is not connected. Configure MONGODBURI and try again.",
    });
  }
  next();
});
app.use("/test", testRoutes);
app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);

  const status =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 600
      ? error.status
      : 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : error.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Students API base URL: http://localhost:${port}/api/students`);
});

if (process.env.MONGODBURI) {
  mongoose
    .connect(process.env.MONGODBURI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error.message));
} else {
  console.warn("MONGODBURI is not set; User and Todo endpoints are unavailable.");
}
