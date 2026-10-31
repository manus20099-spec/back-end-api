import { Router } from "express";

const router = Router();

// In-memory data for REST API practice. Data resets when the server restarts.
let students = [
  { id: 1, name: "Huzaifa", roll_number: 24 },
  { id: 2, name: "Ayesha", roll_number: 25 },
];
let nextId = 3;

// GET /api/students
router.get("/students", (req, res) => {
  res.json(students);
});

// GET /api/students/:id
router.get("/students/:id", (req, res) => {
  const student = students.find((item) => item.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

// POST /api/students
router.post("/students", (req, res) => {
  const { name, roll_number } = req.body ?? {};
  if (!name || roll_number === undefined || roll_number === "") {
    return res.status(400).json({ error: "name and roll_number are required" });
  }

  const student = { id: nextId++, name, roll_number };
  students.push(student);
  res.status(201).json(student);
});

// PUT /api/students/:id replaces a student's editable fields
router.put("/students/:id", (req, res) => {
  const student = students.find((item) => item.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });

  const { name, roll_number } = req.body ?? {};
  if (!name || roll_number === undefined || roll_number === "") {
    return res.status(400).json({ error: "name and roll_number are required" });
  }

  student.name = name;
  student.roll_number = roll_number;
  res.json(student);
});

// PATCH /api/students/:id updates only provided fields
router.patch("/students/:id", (req, res) => {
  const student = students.find((item) => item.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });

  const { name, roll_number } = req.body ?? {};
  if (name !== undefined) student.name = name;
  if (roll_number !== undefined) student.roll_number = roll_number;
  res.json(student);
});

// DELETE /api/students/:id
router.delete("/students/:id", (req, res) => {
  const studentIndex = students.findIndex(
    (item) => item.id === Number(req.params.id),
  );
  if (studentIndex === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  students.splice(studentIndex, 1);
  res.status(204).end();
});

// Query string practice: GET /api/student?abc=value&def=value
router.get("/student", (req, res) => {
  res.json({
    message: "Student API Call...",
    abc: req.query.abc ?? null,
    def: req.query.def ?? null,
  });
});

export default router;
