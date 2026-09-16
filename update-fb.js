const fs = require('fs');
let code = fs.readFileSync('lib/firebase.ts', 'utf8');

code = code.replace(
  'authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,',
  'authDomain: typeof window !== "undefined" ? window.location.host : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,'
);

fs.writeFileSync('lib/firebase.ts', code);
