export default defineOAuthGitHubEventHandler({
  onSuccess: async (e, {user}) => {
    await setUserSession(e, {
      clientId: e.context.cloudflare.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
      clientSecret: e.context.cloudflare.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      user: {
        userId: `github:${user.id}`
      }
    })
    sendRedirect(e, "/")
  }
})
