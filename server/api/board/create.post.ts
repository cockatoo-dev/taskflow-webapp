import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  title: z.string(),
  publicPerms: z.number()
})

export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
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

  const boardId = crypto.randomUUID().substring(0, 8)
  
  const db = useDB(e)
  const userBoards = await db.getUserBoards("")
  if (userBoards.length >= 5) {
    throw createError({
      status: 400,
      message: "You've reached the maximum number of boards for your account. Consider deleting an existing board before you create a new one."
    })
  }
  await db.addBoard(boardId, "", bodyData.title, bodyData.publicPerms)

  return {boardId}
})
