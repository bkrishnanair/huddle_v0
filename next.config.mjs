import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "10.173.30.90:3000",
      "localhost:3000",
      "https://3000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
    ],
  },

  images: {
    unoptimized: true,
  },
  output: "standalone",
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
});
