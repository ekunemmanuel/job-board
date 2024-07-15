// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    credential: (() => {
      try {
        return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}");
      } catch (e) {
        console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", e);
        return {};
      }
    })(),
  },

  modules: [
    "@nuxt/ui",
    "nuxt-vuefire",
    "@vueuse/nuxt",
    "@nuxt/image",
  ],

  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true,
    },
    config: {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
    },
  },

  imports: {
    dirs: [
      // ... or scan all modules within given directory
      "composables/**",
    ],
  },

  compatibilityDate: "2024-07-15",
});