import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "db";
import { tasks, insertTaskSchema } from "db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Get all tasks for the current user
  app.get("/api/tasks", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, req.user.id));
    res.json(userTasks);
  });

  // Create a new task
  app.post("/api/tasks", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const result = insertTaskSchema.safeParse({ ...req.body, userId: req.user.id });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.flatten() });
      }

      // Parse and validate the date
      const deadline = new Date(result.data.deadline);
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({ message: "Invalid deadline date" });
      }

      const [newTask] = await db.insert(tasks).values({
        ...result.data,
        deadline,
        userId: req.user.id,
      }).returning();

      res.json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Error creating task" });
    }
  });

  // Update a task
  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const taskId = parseInt(req.params.id);
    const [existingTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!existingTask || existingTask.userId !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Handle date conversion if deadline is being updated
    const updates = { ...req.body };
    if (updates.deadline) {
      const deadline = new Date(updates.deadline);
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({ message: "Invalid deadline date" });
      }
      updates.deadline = deadline;
    }

    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, taskId))
      .returning();

    res.json(updatedTask);
  });

  // Delete a task
  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const taskId = parseInt(req.params.id);
    const [existingTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!existingTask || existingTask.userId !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));
    res.json({ success: true });
  });
}
