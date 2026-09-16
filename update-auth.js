const fs = require('fs');
let authCode = fs.readFileSync('lib/auth.ts', 'utf8');

// replace signInWithPopup with signInWithRedirect
authCode = authCode.replace('signInWithPopup,', 'signInWithRedirect, getRedirectResult,');

const newGoogleSignIn = `
export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  await signInWithRedirect(auth, googleProvider);
};

export const handleGoogleRedirectResult = async () => {
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
};
`;

authCode = authCode.replace(/export const signInWithGoogle = async \(\) => \{[\s\S]*?return user;\n\};/, newGoogleSignIn.trim());
fs.writeFileSync('lib/auth.ts', authCode);
