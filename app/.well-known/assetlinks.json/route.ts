import 'server-only';

import { androidAssetLinks } from '@/lib/android-asset-links';

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    const links = androidAssetLinks(process.env.ANDROID_PACKAGE_ID, process.env.ANDROID_SHA256_CERT_FINGERPRINTS);
    return Response.json(links, {
      headers: { 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch {
    // Never advertise partial trust or echo configuration into a public error response.
    return Response.json([], { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
