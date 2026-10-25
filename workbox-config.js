module.exports = {
  globDirectory: './',
  globPatterns: [
    '**/*.{html,json,css,js,jpg,jpeg,webp,png,svg}'
  ],
  globIgnores: [
    'docs/**',
    'servidor-ssr/**',
    'node_modules/**',
    'workbox-config.js'
  ],
  swDest: 'sw.js',
  skipWaiting: true,
  clientsClaim: true
};
