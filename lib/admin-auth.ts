import 'server-only';

/**
 * Single definition of "is this caller an admin".
 *
 * There were two admin gates in the codebase with opposite failure modes when
 * `ADMIN_UID` was unset: /api/admin/metrics failed closed, and
 * /api/admin/serendipity-logs failed OPEN, exposing per-student targeting data
 * to any signed-in user. Both now route through this function, so the
 * unconfigured case has one answer.
 *
 * Unconfigured means nobody is an admin. That is deliberate: an admin route
 * that silently opens to everyone is worse than one that is unreachable until
 * the environment is set up correctly.
 */
export function isAdminUid(uid: string | undefined | null): boolean {
  const adminUid = process.env.ADMIN_UID;
  if (!adminUid) return false;
  if (!uid) return false;
  return uid === adminUid;
}
