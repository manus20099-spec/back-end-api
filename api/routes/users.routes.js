import express from "express";
import User from "../models/user.js";
import { createAccessToken, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      data: null,
      error: true,
      errorMsg: "email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        data: null,
        error: true,
        errorMsg: "Invalid email or password",
      });
    }

    if (!/^\$2[aby]\$\d{2}\$/.test(user.password)) {
      user.password = password;
      await user.save();
    }

    const data = user.toObject();
    delete data.password;
    res.json({
      data,
      error: false,
      status: 200,
      token: createAccessToken(user.id),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ data: users, error: false, status: 200 });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, age, email, password } = req.body ?? {};

  if (!name || age === undefined || !email || !password) {
    return res.status(400).json({
      data: null,
      error: true,
      errorMsg: "name, age, email, and password are required",
    });
  }

  try {
    const user = await User.create({
      name,
      age,
      email,
      password,
    });
    const data = user.toObject();
    delete data.password;
    res.status(201).json({ data, error: false, status: 201 });
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
