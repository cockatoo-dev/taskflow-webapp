import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  source: z.string(),
  dest: z.string()
})

// POST /api/deps/remove
// Removes a dependency between two tasks.
export default defineEventHandler(async (e) => {
  await checkAPIWriteEnabled(e)
  
  const userId = await getUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)
  const boardInfo = await getBoardInfo(db, bodyData.boardId, userId)
  if (!canEdit(boardInfo.isOwner, boardInfo.publicPerms)) {
    throw createError({
      status: 403,
      message: "You do not have permission to edit tasks on this board."
    })
  }

  const depsExists = await db.isDepsExist(bodyData.source, bodyData.dest)
  if (!depsExists) {
    throw createError({
      status: 400,
      message: "Dependency does not exist."
    })
  }
  
  const tasksInfo = await db.getTaskPair(bodyData.boardId, bodyData.source, bodyData.dest)
  let newNum: number
  if (tasksInfo[1].isComplete) {
    newNum = tasksInfo[0].numDeps
  } else if (tasksInfo[0].numDeps < 1) {
    newNum = 0
  } else {
    newNum = tasksInfo[0].numDeps - 1
  }

  await db.removeDeps(bodyData.source, bodyData.dest, newNum)
  setResponseStatus(e, 204)
})
