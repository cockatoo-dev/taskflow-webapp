export default defineEventHandler((e) => {
  return defineOAuthGitHubEventHandler({
    onSuccess: async (e, {user}) => {
      await setUserSession(e, {
        user: {
          userId: `github:${user.id}`,
          userName: `${user.login} (Github)`
        }
      })
      sendRedirect(e, "/")
    },
    config: {
      clientId: e.context.cloudflare.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
      clientSecret: e.context.cloudflare.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
    }
  })(e)
})

