const fs = require('fs');
let code = fs.readFileSync('lib/firebase-context.tsx', 'utf8');

code = code.replace(
  'handleGoogleRedirectResult();',
  `handleGoogleRedirectResult().catch(err => {
        console.error("Redirect sign-in error:", err);
        setError(err.message || "Google sign-in failed during redirect.");
      });`
);

fs.writeFileSync('lib/firebase-context.tsx', code);
