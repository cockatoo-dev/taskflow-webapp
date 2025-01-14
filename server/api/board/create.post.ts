import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  title: z.string(),
  publicPerms: z.number()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  if (bodyData.title === "") {
    throw createError({
      status: 400,
      message: 'Board Name is required.'
    })
  } else if (bodyData.title.length > 40) {
    throw createError({
      status: 400,
      message: 'Board Name is too long (maximum 40 characters).'
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
  await db.addBoard(boardId, "", bodyData.title, bodyData.publicPerms)

  return {boardId}
})
