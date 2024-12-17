import { dbErrorHandler, useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const body = await readBody(e)
  const db = useDB(e)

  if (body.source == undefined || body.dest == undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  }

  try {
    const tasksInfo = await db.getTaskPair(body.source, body.dest)
    if (tasksInfo.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "One or more task IDs are invalid."
      })
    }

    let newNum
    if (tasksInfo[0].id == body.source) {
      if (tasksInfo[1].isComplete) {
        newNum = tasksInfo[0].numDeps
      } else if (tasksInfo[0].numDeps < 1) {
        newNum = 0
      } else {
        newNum = tasksInfo[0].numDeps - 1
      }
    } else {
      if (tasksInfo[0].isComplete) {
        newNum = tasksInfo[1].numDeps
      } else if (tasksInfo[1].numDeps < 1) {
        newNum = 0
      } else {
        newNum = tasksInfo[1].numDeps - 1
      }
    }

    await db.removeDeps(body.source, body.dest, newNum)
    return {}
  } catch (err) {
    dbErrorHandler(err)
  }
})