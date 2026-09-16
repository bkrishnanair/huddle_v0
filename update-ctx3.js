const fs = require('fs');
let code = fs.readFileSync('lib/firebase-context.tsx', 'utf8');

const oldFetch = `              const idToken = await user.getIdToken()
              await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              })`;

const newFetch = `              const idToken = await user.getIdToken()
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              })
              if (!res.ok) {
                const text = await res.text();
                throw new Error("Session creation failed: " + text);
              }`;

code = code.replace(oldFetch, newFetch);
fs.writeFileSync('lib/firebase-context.tsx', code);
