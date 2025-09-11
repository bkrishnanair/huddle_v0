/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Replit development environment - allow proxy in dev mode only
  async headers() {
    return process.env.NODE_ENV === 'development' ? [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ] : []
  },
  // Allow all external hosts for development in Replit proxy environment
  experimental: {
    allowedDevOrigins: [
      "http://localhost:5000",
      "https://*.replit.dev",
      "https://*.repl.co"
    ],
  },
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
