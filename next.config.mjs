/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this section to allow local network access
  experimental: {
    allowedDevOrigins: ["10.173.30.90:3000", "localhost:3000", "https://3000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev"],
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
