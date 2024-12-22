import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  taskId: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)
  await checkTaskExists(db, bodyData.boardId, bodyData.taskId)

  await db.deleteTask(bodyData.taskId)
})
