import { dbErrorHandler, useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const id = getQuery(e).id as string
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID"
    })
  }

  const db = useDB(e)
  try {
    const deps = await db.getSourceDepsInfo(id)
    let num = 0
    for (const i of deps) {
      if (!i.isComplete) {
        num += 1
      }
    }

    await db.setTaskNumDeps(id, num)
    return { numDeps: num }
  } catch (err) {
    dbErrorHandler(err)
  }
})
