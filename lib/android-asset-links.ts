import 'server-only';

import { z } from 'zod';

const packageSchema = z.string().max(200).regex(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/);
const fingerprintsSchema = z.array(z.string().regex(/^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/)).min(1).max(10);

/** Unconfigured installations advertise no Android trust; malformed trust fails closed. */
export function androidAssetLinks(packageId?: string, fingerprints?: string) {
  const id = packageId?.trim();
  const certificates = fingerprints?.trim();
  if (!id && !certificates) return [];
  // Package selection precedes Play signing enrollment, so this is a valid pending state.
  if (id && !certificates) {
    packageSchema.parse(id);
    return [];
  }
  const packageName = packageSchema.parse(id);
  const sha256 = fingerprintsSchema.parse(certificates?.split(',').map(value => value.trim().toUpperCase()));
  return [{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: packageName,
      sha256_cert_fingerprints: [...new Set(sha256)],
    },
  }];
}
