import urllib.request
import json

req = urllib.request.Request('https://api.escuelajs.co/api/v1/products/?categoryId=1', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req)
data = json.loads(res.read())

urls = [p['images'][0] for p in data if len(p['images']) > 0]
clean_urls = [u for u in urls if 'placeimg' not in u and 'loremflickr' not in u]

print("Fetched URLs:", clean_urls[:25])
