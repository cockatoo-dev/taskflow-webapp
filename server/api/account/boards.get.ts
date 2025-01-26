import { useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const db = useDB(e)
  const dbData = await db.getUserBoards('')
  return {boards: dbData}
})
