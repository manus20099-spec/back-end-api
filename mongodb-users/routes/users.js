import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ data: users, error: false, status: 200 });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email } = req.body ?? {};

  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      data: null,
      error: true,
      errorMsg: "name and email are required",
    });
  }

  try {
    const user = await User.create({ name, email });
    res.status(201).json({ data: user, error: false, status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        data: null,
        error: true,
        errorMsg: "A user with this email already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        data: null,
        error: true,
        errorMsg: error.message,
      });
    }

    next(error);
  }
});

export default router;
