import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ data: { name: "Bilal" }, error: false, status: 200 });
});

router.post("/", (req, res) => {
  res.send("Post Request");
});

router.put("/", (req, res) => {
  res.send("PUT Request");
});

router.delete("/", (req, res) => {
  res.send("Delete Request");
});

export default router;
