import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  title: z.string(),
  description: z.string()
})

// POST /api/task/add
// Adds a task to a board
export default defineEventHandler(async (e) => {
  await checkAPIWriteEnabled(e)

  const userId = await getUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  if (bodyData.title == '') {
    throw createError({
      statusCode: 400,
      statusMessage: "Please enter a task title."
    })
  } else if (bodyData.title.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task title is too long (maximum 50 characters)."
    })
  } else if (bodyData.description.length > 2500) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task description is too long (maximum 2500 characters)."
    })
  }
  
  const db = useDB(e)
  const taskId = crypto.randomUUID()

  const boardInfo = await getBoardInfo(db, bodyData.boardId, userId)
  if (!canEdit(boardInfo.isOwner, boardInfo.publicPerms)) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission to add tasks to this board."
    })
  }
  const boardTasks = await db.getBoardTasksInfo(bodyData.boardId)
  if (boardTasks.length >= 50) {
    throw createError({
      statusCode: 400,
      statusMessage: "You've reached the maximum number of tasks for this board. Consider deleting an existing task before creating a new task."
    })
  }

  await db.addTask(bodyData.boardId, taskId, bodyData.title, bodyData.description)

  return { taskId }
})
