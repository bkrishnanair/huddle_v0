const fs = require('fs');
let code = fs.readFileSync('lib/firebase-context.tsx', 'utf8');

const oldCatch = `            } catch (err) {
              console.error("Error setting session cookie:", err)
            }`;

const newCatch = `            } catch (err: any) {
              console.error("Error setting session cookie:", err)
              await logOut()
              setUser(null)
              setError(err.message || "Failed to establish server session.")
              setLoading(false)
              return
            }`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('lib/firebase-context.tsx', code);
