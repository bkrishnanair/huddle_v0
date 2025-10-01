/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly allow the development workspace URL to make cross-origin requests
  allowedDevOrigins: [
    'https://0dd4122a-03dd-4484-a1c6-e351798ef760-00-6mghnfont0qn.riker.replit.dev',
    '*' // Keep the wildcard for other environments
  ],
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
