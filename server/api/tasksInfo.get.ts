import { dbErrorHandler, useDB } from "../db/db"

export default defineEventHandler(async (e) => {
  const db = useDB(e)
  try {
    const dbData = await db.getTasksInfo()
    return { tasksInfo: dbData }
  } catch (err) {
    dbErrorHandler(err)
  }
})