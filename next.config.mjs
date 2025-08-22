/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIX: Reverted from a RegExp to a list of exact origin strings.
  // Next.js requires specific origins and does not support patterns here.
  // You will need to add the new URL to this list if the port changes again.
  experimental: {
    allowedDevOrigins: [
      "https://3000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
      "https://44551-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
      "https://38171-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
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
