import { dbErrorHandler, useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const db = useDB(e)
  const id = getQuery(e).id as string

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID"
    })
  }

  try {
    const dbTaskData = await db.getTask(id)
    if (dbTaskData.length < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid task ID"
      })
    }
    
    const dbDepsData = await db.getSourceDepsInfo(id)
    return {
      task: dbTaskData[0],
      deps: dbDepsData
    }
  } catch (err) {
    dbErrorHandler(err)
  }
})
