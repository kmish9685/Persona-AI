# Script to comment out Gumroad endpoints in main.py

with open(r'd:\Persona AI\backend\main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add header comment before Gumroad section
gumroad_header = """
# ============================================
# GUMROAD INTEGRATION - FROZEN FOR LAUNCH
# ============================================
# 
# Commented out to simplify payment flow for launch.
# Reactivate post-PMF when international payments needed.
# 
# ============================================

"""

# Replace the Gumroad section header
content = content.replace(
    "# --- Gumroad Webhook & Activation Routes ---",
    gumroad_header + "# --- Gumroad Webhook & Activation Routes (FROZEN) ---"
)

# Comment out the three Gumroad endpoints
endpoints_to_comment = [
    '@app.post("/webhooks/gumroad")',
    '@app.post("/api/activate-premium")',
    '@app.post("/api/verify-gumroad-purchase")'
]

for endpoint in endpoints_to_comment:
    if endpoint in content:
        # Find the endpoint and comment it out
        lines = content.split('\n')
        new_lines = []
        in_endpoint = False
        indent_level = 0
        
        for i, line in enumerate(lines):
            if endpoint in line:
                in_endpoint = True
                indent_level = len(line) - len(line.lstrip())
                new_lines.append('# ' + line)
            elif in_endpoint:
                # Check if we're still in the function
                if line.strip() and not line.strip().startswith('#'):
                    current_indent = len(line) - len(line.lstrip())
                    if current_indent <= indent_level and line.strip().startswith('@'):
                        # New endpoint found, stop commenting
                        in_endpoint = False
                        new_lines.append(line)
                    else:
                        new_lines.append('# ' + line)
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        
        content = '\n'.join(new_lines)

# Write back
with open(r'd:\Persona AI\backend\main.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Gumroad endpoints commented out successfully")
