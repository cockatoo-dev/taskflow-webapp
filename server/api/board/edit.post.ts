import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  boardId: z.string(),
  boardName: z.string(),
  publicPerms: z.number()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  
  if (bodyData.boardName === "") {
    throw createError({
      status: 400,
      message: 'Board Name is required.'
    })
  } else if (bodyData.boardName.length > 40) {
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

  const db = useDB(e)
  if (!(await db.isBoardExists(bodyData.boardId))) {
    throw createError({
      status: 400,
      message: "Invalid Board ID"
    })
  }
  await db.editBoard(bodyData.boardId, "", bodyData.boardName, bodyData.publicPerms)
})
