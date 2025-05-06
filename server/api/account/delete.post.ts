import { useDB } from "~~/server/db/db"

// DELETE /api/account/delete
// Deletes the user's account and all associated data.
export default defineEventHandler(async (e) => {
  checkAPIEnabled()
  
  const userId = await requireUserId(e)
  const db = useDB(e)
  await db.deleteUserBaords(userId)
  clearUserSession(e)
})
