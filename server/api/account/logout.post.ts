// POST /api/account/logout
// Logout handler via nuxt-auth-utils
export default defineEventHandler(async (e) => {
  await clearUserSession(e)
})
