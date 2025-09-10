/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Replit environment - allow all hosts for proxy support
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ]
  },
  // Allow all external hosts for development in Replit proxy environment
  experimental: {
    allowedDevOrigins: true,
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
