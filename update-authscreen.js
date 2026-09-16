const fs = require('fs');
let code = fs.readFileSync('components/auth-screen.tsx', 'utf8');

code = code.replace(
  'const { user } = useAuth()',
  'const { user, error: contextError } = useAuth()'
);

code = code.replace(
  'const router = useRouter()',
  `const router = useRouter()

  useEffect(() => {
    if (contextError) setError(contextError)
  }, [contextError])`
);

fs.writeFileSync('components/auth-screen.tsx', code);
