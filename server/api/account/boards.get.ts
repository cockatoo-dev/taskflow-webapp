import { useDB } from "~~/server/db/db"

// GET /api/account/boards
// Returns a list of all boards which are owned by the user.
export default defineEventHandler(async (e) => {
  await checkAPIReadEnabled(e)
  
  const userId = await requireUserId(e)
  const db = useDB(e)
  const dbData = await db.getUserBoards(userId)
  return {boards: dbData}
})
