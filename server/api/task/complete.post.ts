import { dbErrorHandler, useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const body = await readBody(e)
  const db = useDB(e)

  const id = body.id

  if (!id || body.value == undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  }

  try {
    if (!(await db.isTaskExists(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid task ID"
      })
    }
    await db.setTaskComplete(id, body.value)
    return {}
  } catch (err) {
    dbErrorHandler(err)
  }
})