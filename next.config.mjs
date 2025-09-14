/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly allow the development workspace URL to make cross-origin requests
  allowedDevOrigins: [
    'https://3000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev',
    'https://3001-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev',
    'https://huddlev1.vercel.app/my-events'
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
