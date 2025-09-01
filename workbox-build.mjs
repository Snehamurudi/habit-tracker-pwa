import { generateSW } from 'workbox-build'

// Generate a service worker into dist/sw.js with precaching and offline navigation fallback
const { count, size, warnings } = await generateSW({
  globDirectory: 'dist',
  globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
  swDest: 'dist/sw.js',
  navigateFallback: '/index.html',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
      }
    },
    {
      urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'assets' }
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
      }
    }
  ]
})

if (warnings.length) {
  console.warn('Workbox warnings:', warnings)
}
console.log(`Generated SW, precached ${count} files, totaling ${size} bytes.`)
