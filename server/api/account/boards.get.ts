import { useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const userId = await requireUserId(e)
  const db = useDB(e)
  const dbData = await db.getUserBoards(userId)
  return {boards: dbData}
})
