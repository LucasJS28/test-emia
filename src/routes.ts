// src/routes.ts
import { Router } from "express";
import { pool } from "./db";

const router = Router();

router.post("/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "El título es obligatorio" });

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *",
      [title, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});


// Listar tareas
router.get("/tasks", async (_req, res) => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
  res.json(result.rows);
});

export default router;
