import re

with open("components/auth-screen.tsx", "r") as f:
    content = f.read()

# Replace any multiple types
content = re.sub(r'type="submit"[\s\n]*type="button"', 'type="submit"', content)
content = re.sub(r'type="button"[\s\n]*type="submit"', 'type="submit"', content)

with open("components/auth-screen.tsx", "w") as f:
    f.write(content)

print("Fixed double type")
