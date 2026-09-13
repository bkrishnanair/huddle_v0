import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
      "10.173.30.90:3000",
      "localhost:3000",
      "https://3000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
  ],

  images: {
    unoptimized: true,
  },
  output: "standalone",
  async headers() {
    return ['/sw.js', '/firebase-messaging-sw.js', '/offline.html'].map(source => ({
      source,
      headers: [{ key: 'Cache-Control', value: 'no-cache, max-age=0, must-revalidate' }],
    }));
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
});
