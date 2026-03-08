import urllib.request
import json

url = "https://fakestoreapi.com/products/category/women's%20clothing"
res = urllib.request.urlopen(url)
data = json.loads(res.read())

print("Women's Clothing URLs:")
for p in data:
    print(p['image'])
    
url2 = "https://fakestoreapi.com/products/category/men's%20clothing"
res2 = urllib.request.urlopen(url2)
data2 = json.loads(res2.read())

print("\nMen's Clothing URLs:")
for p in data2:
    print(p['image'])
