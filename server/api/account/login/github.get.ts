export default defineOAuthGitHubEventHandler({
  onSuccess: async (e, {user}) => {
    await setUserSession(e, {
      clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      user: {
        userId: `github:${user.id}`
      }
    })
    sendRedirect(e, "/")
  }
})
