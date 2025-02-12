export default defineEventHandler((e) => {
  // console.log(`process env clientId ${process.env.NUXT_OAUTH_GITHUB_CLIENT_ID}`)
  // console.log(`cloudflare env clientId ${e.context.cloudflare.env.NUXT_OAUTH_GITHUB_CLIENT_ID}`)
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

// export default defineOAuthGitHubEventHandler({
//   onSuccess: async (e, {user}) => {
//     await setUserSession(e, {
//       user: {
//         userId: `github:${user.id}`
//       }
//     })
//     sendRedirect(e, "/")
//   },
//   config: {
//     clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
//     clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
//   }
// })
