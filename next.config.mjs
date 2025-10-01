/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly allow the development workspace URL for the Next.js dev server
  allowedDevOrigins: [
    'https://9000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev',
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

export default nextConfig;