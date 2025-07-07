import { z } from "zod"
import { useDB } from "~~/server/db/db"

const querySchema = z.object({
  boardId: z.string(),
  taskId: z.string()
})

// GET /api/task/info
// Returns information about a task on a board.
// This includes the task itself, the board it is on, 
// and the dependencies of the task.
export default defineEventHandler(async (e) => {
  await checkAPIReadEnabled(e)
  
  const userId = await getUserId(e)

  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)
  
  const db = useDB(e)

  const boardInfo = await getBoardInfo(db, queryData.boardId, userId)
  const dbTaskData = await db.getTask(queryData.boardId, queryData.taskId)
  if (dbTaskData.length < 1) {
    throw createError({
      status: 400,
      message: "Invalid task ID"
    })
  }
  
  const dbDepsData = await db.getSourceDepsInfo(queryData.taskId)
  return {
    board: boardInfo,
    task: dbTaskData[0],
    deps: dbDepsData
  }
})
