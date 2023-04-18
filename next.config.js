/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: ['db17gxef1g90a.cloudfront.net', 'avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig
