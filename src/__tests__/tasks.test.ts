import request from "supertest";
const express = require("express");
const router = require("../routes").default; // si tu routes.ts usa export default
const { pool } = require("../db"); // cierra la conexión al final

const app = express();
app.use(express.json());
app.use(router);

describe("API de Tareas", () => {
  let createdTaskId: number;

  // Test POST /tasks
  it("Debe crear una nueva tarea", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Tarea de test" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Tarea de test");
    expect(response.body.completed).toBe(false);

    createdTaskId = response.body.id;
  });

  // Test GET /tasks
  it("Debe listar todas las tareas", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Verifica que la tarea creada exista
    const task = response.body.find((t: any) => t.id === createdTaskId);
    expect(task).toBeDefined();
    expect(task.title).toBe("Tarea de test");
  });

  // Cierra la conexión a NeonDB al final
  afterAll(async () => {
    await pool.end();
  });
});
