import re

with open('seed.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find picsum URLs: https://picsum.photos/seed/gege{counter}/800/1200
def replace_url(match):
    counter = match.group(1)
    # Using loremflickr with fashion keywords and a lock to keep the image consistent across reloads
    url = f"https://loremflickr.com/800/1200/fashion,clothing/all?lock={counter}"
    return url

content = re.sub(r'https://picsum\.photos/seed/gege(\d+)/800/1200', replace_url, content)

with open('seed.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced Picsum URLs with Fashion Lorempixel URLs.")
