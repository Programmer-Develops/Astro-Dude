module.exports = ({ config }) => ({
  ...config,
  extra: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  },
});