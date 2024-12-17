import { dbErrorHandler, useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const id = crypto.randomUUID()
  const body = await readBody(e)
  const db = useDB(e)

  if (body.title == undefined || body.description == undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  }

  if (body.title == '') {
    throw createError({
      statusCode: 400,
      statusMessage: "Please enter a task title."
    })
  } else if (body.title.length > 25) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task title is too long."
    })
  } else if (body.description.length > 2500) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task description is too long."
    })
  }

  try {
    await db.addTask(id, body.title as string, body.description as string)
    return { id }
  } catch (err) {
    dbErrorHandler(err)
  }
})
