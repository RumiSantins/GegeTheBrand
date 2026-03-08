import re
import time
from duckduckgo_search import DDGS

# Start duckduckgo search session
ddgs = DDGS()

def get_image(query):
    try:
        results = list(ddgs.images(query, max_results=1))
        if results:
            return results[0]['image']
    except Exception as e:
        print(f"Error fetching {query}: {e}")
    return "https://dummyimage.com/800x1200/cccccc/ffffff.png&text=" + query.replace(" ", "+")

with open('seed.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
skip = False
name = None

for line in lines:
    if line.strip().startswith('"name":'):
        name = line.split('"')[3]
        out_lines.append(line)
        continue
        
    if line.strip().startswith('"images":') and name:
        query = f"{name} ropa de mujer moda"
        print(f"Fetching image for {name}...")
        img_url = get_image(query)
        time.sleep(1) # avoid rate limit
        indent = line.split('"')[0]
        out_lines.append(f"{indent}\"images\": '[\"{img_url}\"]',\n")
        name = None
        continue
        
    out_lines.append(line)

with open('seed.py', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("seed.py updated with precise DuckDuckGo images.")
