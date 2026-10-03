import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';

// CLI-only tooling: never imported into Next.js or installed in its runtime bundle.
const BUBBLEWRAP_VERSION = '1.25.0';
const root = fileURLToPath(new URL('../', import.meta.url));
const twa = path.join(root, 'android/twa');
const generated = path.join(twa, 'generated');
const manifestPath = path.join(generated, 'twa-manifest.json');
const stampPath = path.join(generated, '.huddle-generation.json');
dotenv.config({ path: path.join(root, '.env.local'), quiet: true });
dotenv.config({ path: path.join(root, '.env'), quiet: true });

async function json(file) { return JSON.parse(await readFile(file, 'utf8')); }
async function exists(file) { try { await access(file); return true; } catch { return false; } }
function requireCondition(condition, message) { if (!condition) throw new Error(message); }

async function configuration() {
  const config = await json(path.join(twa, 'config.json'));
  const packageId = process.env.ANDROID_PACKAGE_ID?.trim();
  requireCondition(packageId && /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(packageId) && packageId.length <= 200,
    'Set ANDROID_PACKAGE_ID to your confirmed permanent app ID in .env.local first. See android/twa/README.md.');
  requireCondition(config.host === 'www.huddlemap.live', 'Reassess domain redirects and Digital Asset Links before changing the Android host.');
  requireCondition(Number.isSafeInteger(config.appVersionCode) && config.appVersionCode > 0 && typeof config.appVersion === 'string' && config.appVersion.length > 0,
    'Set a positive Android version code and a nonempty version name in config.json.');
  requireCondition(config.fallbackType === 'customtabs', 'Keep the browser fallback; an embedded WebView can break Google authentication.');
  requireCondition(config.signingKey.path === '../signing/huddle-upload.keystore', 'Keep signing material outside the generated directory.');
  const manifest = { ...config, packageId };
  const digest = createHash('sha256').update(JSON.stringify({ manifest, bubblewrap: BUBBLEWRAP_VERSION })).digest('hex');
  return { manifest, digest };
}

function bubblewrap(args) {
  return new Promise((resolve, reject) => {
    // Argument arrays, no shell interpolation. npm caches this exact tool version.
    const child = spawn('npx', ['--yes', `--package=@bubblewrap/cli@${BUBBLEWRAP_VERSION}`, 'bubblewrap', ...args], {
      cwd: generated, stdio: 'inherit', shell: false,
    });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Bubblewrap exited with ${code ?? 'a signal'}.`)));
  });
}

async function generate(manifest, digest) {
  if (await exists(manifestPath)) {
    const previous = await json(manifestPath);
    requireCondition(previous.packageId === manifest.packageId, 'Package ID differs from the generated app. Do not accidentally replace an existing Play identity.');
    requireCondition(previous.appVersionCode <= manifest.appVersionCode, 'Android version codes cannot decrease. Update config.json.');
  }
  await mkdir(generated, { recursive: true });
  await mkdir(path.join(twa, 'signing'), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  // Invalidate a previous success before a generator that might fail halfway through.
  await writeFile(stampPath, JSON.stringify({ digest: null }) + '\n');
  console.log('Generating only android/twa/generated. Do not hand-edit files in that directory.');
  console.log('Bubblewrap may ask to install its Java/Android tools and accept SDK licenses.');
  await bubblewrap(['update', '--skipVersionUpgrade']);
  await writeFile(stampPath, JSON.stringify({ digest, bubblewrap: BUBBLEWRAP_VERSION }) + '\n');
  console.log('Android source generated. Create/configure your upload key before android:build.');
}

async function build(manifest, digest) {
  requireCondition(await exists(stampPath), 'Run npm run android:generate first.');
  const stamp = await json(stampPath);
  requireCondition(stamp.digest === digest, 'Android config changed or generation failed. Run npm run android:generate again.');
  const saved = await json(manifestPath);
  // Bubblewrap can normalize/add defaults, so compare the release identity explicitly.
  requireCondition(saved.packageId === manifest.packageId && saved.host === manifest.host && saved.appVersionCode === manifest.appVersionCode && saved.appVersion === manifest.appVersion && saved.startUrl === manifest.startUrl,
    'Generated identity/version differs from config.json. Regenerate before building.');
  requireCondition(await exists(path.resolve(generated, manifest.signingKey.path)), 'Upload keystore missing. Follow android/twa/README.md; never commit signing keys.');
  await bubblewrap(['build']);
  console.log('Local artifacts: android/twa/generated/app-release-bundle.aab and app-release-signed.apk. Nothing was uploaded.');
}

async function verifyLinks(manifest) {
  const expected = process.env.ANDROID_SHA256_CERT_FINGERPRINTS?.split(',').map(value => value.trim().toUpperCase());
  requireCondition(expected?.length > 0 && expected.length <= 10 && expected.every(value => /^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/.test(value)),
    'Set ANDROID_SHA256_CERT_FINGERPRINTS to the real Play app-signing certificate(s).');
  const response = await fetch(`https://${manifest.host}/.well-known/assetlinks.json`, {
    redirect: 'manual', signal: AbortSignal.timeout(15000), cache: 'no-store',
  });
  requireCondition(response.status === 200, `Asset Links must return 200 without a redirect; got ${response.status}. Deploy the endpoint/env settings first.`);
  requireCondition((response.headers.get('content-type') || '').includes('application/json'), 'Asset Links must be served as application/json.');
  const links = await response.json();
  requireCondition(Array.isArray(links), 'Asset Links response must be an array.');
  const verified = expected.every(fingerprint => links.some(link =>
    link?.relation?.includes('delegate_permission/common.handle_all_urls') &&
    link?.target?.namespace === 'android_app' && link.target.package_name === manifest.packageId &&
    link.target.sha256_cert_fingerprints?.includes(fingerprint)));
  requireCondition(verified, 'Published Asset Links do not match the configured package and signing certificates.');
  console.log('Published www domain association matches. Still test an actual Play-installed build; this is not an Android device verification.');
}

try {
  const command = process.argv[2];
  requireCondition(['generate', 'build', 'verify-links'].includes(command), 'Use android:generate, android:build, or android:verify-links.');
  const { manifest, digest } = await configuration();
  if (command === 'generate') await generate(manifest, digest);
  else if (command === 'build') await build(manifest, digest);
  else await verifyLinks(manifest);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Android tooling failed.');
  process.exitCode = 1;
}
