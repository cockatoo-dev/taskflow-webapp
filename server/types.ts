export type Task = {
  id: string,
  title: string,
  description: string,
  status: "not ready" | "ready" | "completed",
  depsIds: string[],
  assignedId: string | null
}
