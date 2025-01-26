import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
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

  const db = useDB(e)
  if (!(await db.isBoardExists(bodyData.boardId))) {
    throw createError({
      status: 400,
      message: "Invalid Board ID"
    })
  }
  await db.editBoard(bodyData.boardId, "", bodyData.title, bodyData.publicPerms)
})
