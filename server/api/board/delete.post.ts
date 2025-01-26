import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  boardId: z.string()
})

export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)
  if (!(await db.isBoardExists(bodyData.boardId))) {
    throw createError({
      status: 400,
      message: "Invalid Board ID"
    })
  }
  await db.deleteBoard(bodyData.boardId, "")
})
