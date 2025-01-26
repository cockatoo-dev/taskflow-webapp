import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  taskId: z.string()
})

export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)
  await checkTaskExists(db, bodyData.boardId, bodyData.taskId)

  console.log(`depscheck ${bodyData.boardId} ${bodyData.taskId}`)

  const deps = await db.getSourceDepsInfo(bodyData.taskId)
  let num = 0
  for (const i of deps) {
    if (!i.isComplete) {
      num += 1
    }
  }

  await db.setTaskNumDeps(bodyData.taskId, num)
  return { numDeps: num }
})
