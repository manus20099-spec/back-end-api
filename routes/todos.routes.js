import express from "express";
import Todo from "../models/todo.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find({ createdBy: req.userId }).populate(
      "createdBy",
      "name email",
    );
    res.json({ data: todos, error: false, status: 200 });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body ?? {};
    const todo = await Todo.create({ title, createdBy: req.userId });
    res.status(201).json({ status: 201, data: todo, error: false });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        status: 400,
        data: null,
        error: true,
        errorMsg: error.message,
      });
    }
    next(error);
  }
});

export default router;
