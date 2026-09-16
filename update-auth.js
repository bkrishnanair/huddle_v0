const fs = require('fs');
let code = fs.readFileSync('lib/auth.ts', 'utf8');

const oldFunc = `export const handleGoogleRedirectResult = async () => {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const user = result.user;
      const userProfile = await getUser(user.uid);
      if (!userProfile) {
        await createUser(user.uid, {
          email: user.email!,
          name: user.displayName || user.email?.split('@')[0] || 'New User',
          photoURL: user.photoURL || null,
        });
      }
      return user;
    }
  } catch (error) {
    console.error("Redirect sign-in error:", error);
  }
  return null;
};`;

const newFunc = `export const handleGoogleRedirectResult = async () => {
  if (!auth) return null;
  const result = await getRedirectResult(auth);
  if (result?.user) {
    const user = result.user;
    const userProfile = await getUser(user.uid);
    if (!userProfile) {
      await createUser(user.uid, {
        email: user.email!,
        name: user.displayName || user.email?.split('@')[0] || 'New User',
        photoURL: user.photoURL || null,
      });
    }
    return user;
  }
  return null;
};`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('lib/auth.ts', code);
