// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-03-27',
  devtools: { enabled: true },

  future: {compatibilityVersion: 4},

  nitro: {
    preset: "cloudflare-pages"
  },

  modules: [
    "nitro-cloudflare-dev",
    "@nuxt/ui",
    "@nuxt/eslint",
    '@nuxt/fonts',
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "nuxt-security"
  ],

  css: ['~/assets/style.css'],
  
  fonts: {
    families: [
      {name: 'Open Sans', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal', 'italic']},
      {name: 'Apple Color Emoji', provider: 'none'},
      {name: 'Segoe UI Emoji', provider: 'none'},
      {name: 'Segoe UI Symbol', provider: 'none'},
      {name: 'Noto Color Emoji', provider: 'none'},
    ],
  },

  security: {
    corsHandler: false,
    csrf: true
  },
  csurf: {
    methodsToProtect: ['POST', 'PATCH', 'PUT', 'DELETE']
  },
  routeRules: {
    '/': {prerender: true},
    '/api/_auth/session': {csurf: false}
  }
})
