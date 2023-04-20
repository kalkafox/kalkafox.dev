/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: ['voldunai-cdn.kalkafox.dev', 'avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig
