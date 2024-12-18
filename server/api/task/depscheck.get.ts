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
  await checkTaskExists(db, queryData.boardId, queryData.taskId)

  const deps = await db.getSourceDepsInfo(queryData.taskId)
  let num = 0
  for (const i of deps) {
    if (!i.isComplete) {
      num += 1
    }
  }

  await db.setTaskNumDeps(queryData.taskId, num)
  return { numDeps: num }
})

