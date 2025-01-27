export default defineOAuthGitHubEventHandler({
  onSuccess: async (e, {user}) => {
    await setUserSession(e, {
      user: {
        userId: `github:${user.id}`
      }
    })
    sendRedirect(e, "/")
  }
})
