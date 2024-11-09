import useSWR, { mutate } from "swr";
import type { Task, InsertTask } from "db/schema";

export function useTasks() {
  const { data: tasks } = useSWR<Task[]>("/api/tasks");

  const createTask = async (task: InsertTask) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    mutate("/api/tasks");
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    mutate("/api/tasks");
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    mutate("/api/tasks");
  };

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
