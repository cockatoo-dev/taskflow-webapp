import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  taskId: z.string(),
  title: z.string(),
  description: z.string()
})

// POST /api/task/edit
// Edits a task on a board
export default defineEventHandler(async (e) => {
  await checkAPIWriteEnabled(e)

  const userId = await getUserId(e)
  
  const boydParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(boydParse)

  if (bodyData.title == '') {
    throw createError({
      status: 400,
      message: "Please enter a task title."
    })
  } else if (bodyData.title.length > 50) {
    throw createError({
      status: 400,
      message: "Task title is too long (maximum 50 characters)."
    })
  } else if (bodyData.description.length > 2500) {
    throw createError({
      status: 400,
      message: "Task description is too long (maximum 2500 characters)."
    })
  }

  const db = useDB(e)

  const boardInfo = await getBoardInfo(db, bodyData.boardId, userId)
  if (!canEdit(boardInfo.isOwner, boardInfo.publicPerms)) {
    throw createError({
      status: 403,
      message: "You do not have permission to edit tasks on this board."
    })
  }

  await checkTaskExists(db, bodyData.boardId, bodyData.taskId)

  await db.editTask(bodyData.taskId, bodyData.title, bodyData.description)
  setResponseStatus(e, 204)
})
