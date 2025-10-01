/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Replit proxy domains for development
  allowedDevOrigins: [
    '*.replit.dev',
    '*.repl.co',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        '*.replit.dev',
        '*.repl.co',
      ],
    },
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
