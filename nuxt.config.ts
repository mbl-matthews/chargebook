// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'vuetify-nuxt-module',
    '@vite-pwa/nuxt',
    'nuxt-auth-utils'
  ],
  pwa: {
    manifest: {
      name: 'Chargebook',
      short_name: 'Chargebook',
      theme_color: '#1867C0',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  }
})