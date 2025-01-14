import { useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const db = useDB(e)
  await db.deleteUserBaords('')
})
