// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-19',
  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare_module',
  },

  modules: ['nitro-cloudflare-dev', '@nuxt/ui'],

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      bodyAttrs: {
        class: 'bg-white dark:bg-gray-900',
      },
    },
  },
});
