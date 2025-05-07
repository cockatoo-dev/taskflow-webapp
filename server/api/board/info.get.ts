import { z } from "zod"
import { useDB } from "~~/server/db/db"

const querySchema = z.object({
  boardId: z.string()
})

// GET /api/board/info
// Returns information about a board.
export default defineEventHandler(async (e) => {
  await checkAPIReadEnabled(e)
  
  const userId = await getUserId(e)
  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)

  const db = useDB(e)
  
  return await getBoardInfo(db, queryData.boardId, userId)
})
