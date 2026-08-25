import { describe, it, expect, afterEach } from 'vitest';
import { authorizeCronRequest } from '@/lib/cron/auth';
import type { NextRequest } from 'next/server';

/**
 * Guards B7.
 *
 * All six cron routes compared against `Bearer ${process.env.CRON_SECRET}`.
 * With the variable unset that template literal is the literal string
 * "Bearer undefined" — so Vercel Cron, sending a real secret, got 401, while
 * anyone sending `Authorization: Bearer undefined` got 200 and could trigger
 * the reminder, cleanup and serendipity jobs on demand.
 *
 * The first test below is the one that matters: it fails if the unconfigured
 * case is ever allowed to fall through again.
 */

function req(authorization?: string, url = 'https://huddlemap.live/api/cron/dispatch') {
  return {
    url,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === 'authorization' ? authorization ?? null : null,
    },
  } as unknown as NextRequest;
}

describe('authorizeCronRequest', () => {
  const originalSecret = process.env.CRON_SECRET;
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalSecret;
    // NODE_ENV is readonly in the Next types but writable at runtime.
    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  });

  it('refuses everything when CRON_SECRET is unset', () => {
    delete process.env.CRON_SECRET;
    const result = authorizeCronRequest(req('Bearer something'));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(500);
  });

  it('refuses the exact "Bearer undefined" string that used to succeed', () => {
    delete process.env.CRON_SECRET;
    const result = authorizeCronRequest(req('Bearer undefined'));
    expect(result.ok).toBe(false);
  });

  it('accepts the correct bearer token', () => {
    process.env.CRON_SECRET = 's3cret';
    expect(authorizeCronRequest(req('Bearer s3cret')).ok).toBe(true);
  });

  it('rejects a wrong token with 401, not 500', () => {
    process.env.CRON_SECRET = 's3cret';
    const result = authorizeCronRequest(req('Bearer wrong'));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(401);
  });

  it('rejects a missing header', () => {
    process.env.CRON_SECRET = 's3cret';
    expect(authorizeCronRequest(req(undefined)).ok).toBe(false);
  });

  it('accepts the query-string fallback only in development', () => {
    process.env.CRON_SECRET = 's3cret';
    const withQuery = req(undefined, 'https://huddlemap.live/api/cron/dispatch?secret=s3cret');

    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    expect(authorizeCronRequest(withQuery).ok).toBe(false);

    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    expect(authorizeCronRequest(withQuery).ok).toBe(true);
  });

  it('rejects a wrong query secret even in development', () => {
    process.env.CRON_SECRET = 's3cret';
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    const wrong = req(undefined, 'https://huddlemap.live/api/cron/dispatch?secret=nope');
    expect(authorizeCronRequest(wrong).ok).toBe(false);
  });
});
