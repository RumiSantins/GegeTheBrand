import urllib.request
import json

req = urllib.request.Request('https://dummyjson.com/products?limit=150', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req)
data = json.loads(res.read())

valid_categories = ['womens-dresses', 'womens-shoes', 'tops', 'womens-shirts', 'mens-shirts', 'mens-shoes', 'womens-bags', 'sunglasses']
urls = []
for p in data['products']:
    if p['category'] in valid_categories:
        if p.get('images') and len(p['images']) > 0:
            urls.append(p['images'][0])

print("Found DummyJSON URLs:", len(urls))
print(urls[:25])
