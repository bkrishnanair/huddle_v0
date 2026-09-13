import re

with open("app/(app)/layout.tsx", "r") as f:
    content = f.read()

bad_effect = """  useEffect(() => {
    // Intercept redirect for unauthenticated users visiting protected routes
    if (!loading && !user && !isPublicRoute) {
      if (!showAuthGate) {
        setShowAuthGate(true)
      }
    } else {
      setShowAuthGate(false)
    }
  }, [user, loading, isPublicRoute, showAuthGate])"""

good_effect = """  useEffect(() => {
    // Intercept redirect for unauthenticated users visiting protected routes
    if (!loading && !user && !isPublicRoute) {
      setShowAuthGate(true)
    } else {
      setShowAuthGate(false)
    }
  }, [user, loading, isPublicRoute])"""

content = content.replace(bad_effect, good_effect)

with open("app/(app)/layout.tsx", "w") as f:
    f.write(content)

print("Fixed layout effect")
