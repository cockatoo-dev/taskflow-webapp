import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  boardId: z.string()
})

// POST /api/board/delete
// Deletes a board.
export default defineEventHandler(async (e) => {
  await checkAPIWriteEnabled(e)
  
  const userId = await requireUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)

  const boardInfo = await db.getBoard(bodyData.boardId)
  if (boardInfo.length === 0) {
    throw createError({
      status: 400,
      message: "Invalid board ID."
    })
  } else if (boardInfo[0].ownerId !== userId) {
    throw createError({
      status: 403,
      message: "Cannot delete a board which you do not own."
    })
  }
  await db.deleteBoard(bodyData.boardId, userId)
  setResponseStatus(e, 204)
})
