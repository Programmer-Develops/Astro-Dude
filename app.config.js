module.exports = ({ config }) => ({
  ...config,
  name: "Astro Dude",
  slug: "adude",
  version: "1.0.0",
  android: {
    package: "com.shantanupandya.adude",
    versionCode: 1,
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.shantanupandya.adude"
  },
  extra: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
    eas: {
      projectId: "6045806b-cf62-4d4f-a1e0-aecbaf7b1699"
    }
  },
});