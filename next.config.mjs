/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow all origins for Replit proxy environment
  allowedDevOrigins: ['*'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
}

export default nextConfig
