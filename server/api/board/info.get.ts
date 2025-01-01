import { z } from "zod"
import { useDB } from "~/server/db/db"

const querySchema = z.object({
  boardId: z.string()
})

export default defineEventHandler(async (e) => {
  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)

  const db = useDB(e)
  const dbData = await db.getBoard(queryData.boardId)
  if (dbData.length === 0) {
    throw createError({
      status: 400,
      message: 'Invlaid board ID.'
    })
  } else {
    return {
      boardId: dbData[0].boardId,
      isOwner: true,
      boardName: dbData[0].title,
      publicPerms: dbData[0].publicPerms
    }
  }
})
