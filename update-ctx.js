const fs = require('fs');
let ctxCode = fs.readFileSync('lib/firebase-context.tsx', 'utf8');

ctxCode = ctxCode.replace('import { logOut } from "./auth"', 'import { logOut, handleGoogleRedirectResult } from "./auth"');

ctxCode = ctxCode.replace(
  '// FIX: Ensure auth object is not null before setting up the listener.\n    if (auth) {',
  '// FIX: Ensure auth object is not null before setting up the listener.\n    if (auth) {\n      handleGoogleRedirectResult();'
);

fs.writeFileSync('lib/firebase-context.tsx', ctxCode);
