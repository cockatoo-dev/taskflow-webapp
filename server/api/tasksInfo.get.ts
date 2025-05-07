import { z } from "zod"
import { useDB } from "../db/db"

const querySchema = z.object({
  boardId: z.string()
})

// GET /api/tasksInfo
// Returns limited information about all tasks on a board.
// This is used for generating a list of tasks 
// that can be added as dependencies.
export default defineEventHandler(async (e) => {
  await checkAPIReadEnabled(e)
  
  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)
  
  const db = useDB(e)
  const dbData = await db.getBoardTasksInfo(queryData.boardId)
  return { tasksInfo: dbData }
})
