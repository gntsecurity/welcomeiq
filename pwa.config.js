module.exports = {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/your-backend-api\.com/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      },
    },
    {
      urlPattern: /.*/,
      handler: 'StaleWhileRevalidate',
    },
  ],
}
