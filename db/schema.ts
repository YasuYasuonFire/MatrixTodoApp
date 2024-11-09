import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => users.id).notNull(),
  title: text("title").notNull(),
  deadline: timestamp("deadline").notNull(),
  important: boolean("important").notNull(),
  urgent: boolean("urgent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Custom task schema with date validation
export const insertTaskSchema = z.object({
  userId: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  deadline: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Invalid date format"),
  important: z.boolean(),
  urgent: z.boolean(),
});

export const selectTaskSchema = createSelectSchema(tasks);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = z.infer<typeof selectTaskSchema>;
