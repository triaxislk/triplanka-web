import os
import re
from urllib.parse import unquote

base_dir = r"c:\Users\koral\OneDrive\Documents\TriAxis\Github\triplanka-web"
html_files = []

for root, dirs, files in os.walk(base_dir):
    # Only walk folders that are likely to have HTML
    if any(x in root for x in ['node_modules', '.git', '.agent', '.gemini', 'backups', 'metadata', 'scripts']):
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

broken_links = []

for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {html_file}: {e}")
        continue
        
    # Find href and src
    links = re.findall(r'(?:href|src)=["\'](.*?)["\']', content)
    
    for link in links:
        # Skip external and fragments
        if link.startswith(('http', 'mailto:', 'tel:', 'whatsapp:', '#', 'data:')) or not link:
            continue
            
        # Clean link
        clean_link = link.split('?')[0].split('#')[0]
        unquoted_link = unquote(clean_link).replace('/', os.sep)
        
        # Resolve path
        file_dir = os.path.dirname(html_file)
        target_path = os.path.normpath(os.path.join(file_dir, unquoted_link))
        
        if not os.path.exists(target_path):
            # Check if it was a false positive for an absolute path starting with /
            if link.startswith('/'):
                alt_path = os.path.normpath(os.path.join(base_dir, unquoted_link.lstrip(os.sep)))
                if os.path.exists(alt_path):
                    continue
                    
            rel_file = os.path.relpath(html_file, base_dir)
            broken_links.append(f"{rel_file}: {link} -> (Expected: {target_path})")

print(f"--- BROKEN_LINKS_REPORT ---")
for bl in sorted(set(broken_links)):
    print(bl)
print(f"--- END_OF_REPORT ---")
