import re

with open("components/auth-screen.tsx", "r") as f:
    content = f.read()

# 1. Add useEffect import if not there
if "useEffect" not in content:
    content = content.replace('import { useState }', 'import { useState, useEffect }')

# 2. Add the redirection logic inside AuthScreen
redirection_logic = """  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If the user is already signed in, don't trap them on a spinner if onLogin isn't called
    if (user && !isLoading) {
      router.push("/map")
    }
  }, [user, isLoading, router])"""

if "useEffect(() => {" not in content:
    content = content.replace("""  const { user } = useAuth()
  const router = useRouter()""", redirection_logic)

# 3. Add forms and onSubmit for Enter key submission
# Replace the login fields wrapper
login_wrapper_old = """        <TabsContent value="login" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-xs font-semibold">Email</Label>"""
login_wrapper_new = """        <TabsContent value="login">
          <form onSubmit={(e) => { e.preventDefault(); handleAuthAction('login'); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-xs font-semibold">Email</Label>"""
content = content.replace(login_wrapper_old, login_wrapper_new)

# Add closing form tag for login
login_button_old = """            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
        </TabsContent>"""
login_button_new = """            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
        </form>
        </TabsContent>"""
content = content.replace(login_button_old, login_button_new)

# Signup wrapper
signup_wrapper_old = """        <TabsContent value="signup" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-white text-xs font-semibold">Name</Label>"""
signup_wrapper_new = """        <TabsContent value="signup">
          <form onSubmit={(e) => { e.preventDefault(); handleAuthAction('signup'); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-white text-xs font-semibold">Name</Label>"""
content = content.replace(signup_wrapper_old, signup_wrapper_new)

# Add closing form tag for signup
signup_button_old = """            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
        </TabsContent>"""
signup_button_new = """            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
        </form>
        </TabsContent>"""
content = content.replace(signup_button_old, signup_button_new)

# Make buttons type="submit"
content = content.replace('onClick={() => handleAuthAction("login")}', 'type="submit"')
content = content.replace('onClick={() => handleAuthAction("signup")}', 'type="submit"')

with open("components/auth-screen.tsx", "w") as f:
    f.write(content)

print("Fixed auth screen")
