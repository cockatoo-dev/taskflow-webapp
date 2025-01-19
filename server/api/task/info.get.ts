import { z } from "zod"
import { useDB } from "~/server/db/db"

const querySchema = z.object({
  boardId: z.string(),
  taskId: z.string()
})

export default defineEventHandler(async (e) => {
  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)
  
  const db = useDB(e)

  const boardInfo = await getBoardInfo(db, queryData.boardId, '')
  const dbTaskData = await db.getTask(queryData.boardId, queryData.taskId)
  if (dbTaskData.length < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID"
    })
  }
  
  const dbDepsData = await db.getSourceDepsInfo(queryData.taskId)
  return {
    board: boardInfo,
    task: dbTaskData[0],
    deps: dbDepsData
  }
})
