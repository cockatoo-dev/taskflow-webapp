import { z } from "zod"
import { useDB } from "~~/server/db/db"

const bodySchema = z.object({
  title: z.string(),
  publicPerms: z.number()
})

// POST /api/board/create
// Creates a new board
export default defineEventHandler(async (e) => {
  await checkAPIWriteEnabled(e)
  
  const userId = await requireUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  if (bodyData.title === "") {
    throw createError({
      statusCode: 400,
      statusMessage: 'Board Name is required.'
    })
  } else if (bodyData.title.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Board Name is too long (maximum 50 characters).'
    })
  } else if (
    bodyData.publicPerms !== 0 &&
    bodyData.publicPerms !== 1 &&
    bodyData.publicPerms !== 2
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Public Permissions setting.'
    })
  }

  const boardId = crypto.randomUUID().substring(0, 8)
  
  const db = useDB(e)
  const userBoards = await db.getUserBoards(userId)
  if (userBoards.length >= 5) {
    throw createError({
      statusCode: 400,
      statusMessage: "You've reached the maximum number of boards for your account. Consider deleting an existing board before you create a new one."
    })
  }
  await db.addBoard(boardId, userId, bodyData.title, bodyData.publicPerms)

  return {boardId}
})
