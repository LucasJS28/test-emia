"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes.ts
const express_1 = require("express");
const db_1 = require("./db");
const router = (0, express_1.Router)();
router.post("/tasks", async (req, res) => {
    const { title } = req.body;
    if (!title)
        return res.status(400).json({ error: "El título es obligatorio" });
    try {
        const result = await db_1.pool.query("INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *", [title, false]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la tarea" });
    }
});
// Listar tareas
router.get("/tasks", async (_req, res) => {
    const result = await db_1.pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
});
exports.default = router;
