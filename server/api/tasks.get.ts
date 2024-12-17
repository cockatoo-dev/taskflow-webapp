import { dbErrorHandler, useDB } from "../db/db"

export default defineEventHandler(async (e) => {
  const db = useDB(e)

  try {
    const dbData = await db.getTasks()
    return {
      tasks: dbData,
    }
  } catch (err) {
    dbErrorHandler(err)
  }
})
