import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  taskId: z.string(),
  value: z.boolean()
})

// POST /api/task/complete
// Marks a task as completed or not completed
export default defineEventHandler(async (e) => {
  await checkAPIWriteEnabled(e)
  
  const userId = await getUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)
  const boardInfo = await getBoardInfo(db, bodyData.boardId, userId)
  if (!canSetComplete(boardInfo.isOwner, boardInfo.publicPerms)) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission to mark tasks as completed on this board."
    })
  }

  await checkTaskExists(db, bodyData.boardId, bodyData.taskId)

  await db.setTaskComplete(bodyData.taskId, bodyData.value)
  setResponseStatus(e, 204)
})
