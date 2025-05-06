import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  title: z.string(),
  publicPerms: z.number()
})

// POST /api/board/edit
// Edits a board's name and public permissions.
export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const userId = await requireUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  
  if (bodyData.title === "") {
    throw createError({
      status: 400,
      message: 'Board Name is required.'
    })
  } else if (bodyData.title.length > 50) {
    throw createError({
      status: 400,
      message: 'Board Name is too long (maximum 50 characters).'
    })
  } else if (
    bodyData.publicPerms !== 0 &&
    bodyData.publicPerms !== 1 &&
    bodyData.publicPerms !== 2
  ) {
    throw createError({
      status: 400,
      message: 'Invalid Public Permissions setting.'
    })
  }

  const db = useDB(e)
  const boardInfo = await db.getBoard(bodyData.boardId)
  if (boardInfo.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Invalid board ID."
    })
  } else if (boardInfo[0].ownerId !== userId) {
    throw createError({
      statusCode: 403,
      message: "Cannot change board settings for a board which you do not own."
    })
  }
  await db.editBoard(bodyData.boardId, userId, bodyData.title, bodyData.publicPerms)
})
