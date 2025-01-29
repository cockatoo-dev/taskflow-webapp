import { z } from "zod"
import { useDB } from "../db/db"

const querySchema = z.object({
  boardId: z.string()
})

export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const userId = await getUserId(e)
  
  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)
  
  const db = useDB(e)

  const boardInfo = await getBoardInfo(db, queryData.boardId, userId)

  const dbData = await db.getBoardTasks(queryData.boardId)
  return {
    board: boardInfo,
    tasks: dbData
  }
})
