import json

url_map = {
    "Camiseta Básica Premium": '["https://loremflickr.com/800/1200/woman,white,tshirt?lock=101", "https://loremflickr.com/800/1200/woman,tshirt?lock=102"]',
    "Crop Top Deportivo": '["https://loremflickr.com/800/1200/woman,croptop,fitness?lock=103"]',
    "Blusa Elegante de Seda": '["https://loremflickr.com/800/1200/woman,silk,blouse?lock=104"]',
    "Sudadera Oversize con Capucha": '["https://loremflickr.com/800/1200/woman,hoodie?lock=105"]',
    "Camisa Denim Vintage": '["https://loremflickr.com/800/1200/woman,denim,shirt?lock=106"]',
    "Jean Wide Leg 90s": '["https://loremflickr.com/800/1200/woman,wide,jeans?lock=107"]',
    "Pantalón de Lino Recto": '["https://loremflickr.com/800/1200/woman,linen,pants?lock=108"]',
    "Leggings Sculpting": '["https://loremflickr.com/800/1200/woman,leggings,fitness?lock=109"]',
    "Pantalón Cargo Urbano": '["https://loremflickr.com/800/1200/woman,cargo,pants?lock=110"]',
    "Pantalón Sastre Holgado": '["https://loremflickr.com/800/1200/woman,tailored,trousers?lock=111"]',
    "Trench Coat Clásico": '["https://loremflickr.com/800/1200/woman,trenchcoat?lock=112"]',
    "Casaca de Cuero Biker": '["https://loremflickr.com/800/1200/woman,leather,jacket?lock=113"]',
    "Abrigo de Lana Minimalista": '["https://loremflickr.com/800/1200/woman,wool,coat?lock=114"]',
    "Chaqueta Puffer Acolchada": '["https://loremflickr.com/800/1200/woman,puffer,jacket?lock=115"]',
    "Blazer Oversize Boyfriend": '["https://loremflickr.com/800/1200/woman,blazer?lock=116"]',
    "Zapatillas Chunky Urbanas": '["https://loremflickr.com/800/1200/woman,sneakers?lock=117"]',
    "Botines Chelsea de Cuero": '["https://loremflickr.com/800/1200/woman,chelsea,boots?lock=118"]',
    "Mocasines Clásicos": '["https://loremflickr.com/800/1200/woman,loafers?lock=119"]',
    "Sandalias de Tiras": '["https://loremflickr.com/800/1200/woman,sandals?lock=120"]',
    "Zapatillas de Lona": '["https://loremflickr.com/800/1200/woman,canvas,shoes?lock=121"]',
    "Vestido Midi de Lino": '["https://loremflickr.com/800/1200/woman,linen,dress?lock=122"]',
    "Slip Dress de Satén": '["https://loremflickr.com/800/1200/woman,satin,dress?lock=123"]',
    "Vestido Camisero Estampado": '["https://loremflickr.com/800/1200/woman,shirt,dress?lock=124"]',
    "Vestido LBD Clásico": '["https://loremflickr.com/800/1200/woman,black,dress?lock=125"]',
    "Vestido Floral Maxi": '["https://loremflickr.com/800/1200/woman,floral,dress?lock=126"]'
}

with open('seed.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
skip = False
for line in lines:
    if line.strip().startswith('"name":'):
        name = line.split('"')[3]
        out_lines.append(line)
        continue
        
    if line.strip().startswith('"images":'):
        if name in url_map:
            indent = line.split('"')[0]
            out_lines.append(f"{indent}\"images\": '{url_map[name]}',\n")
        else:
            out_lines.append(line)
        continue
        
    out_lines.append(line)

with open('seed.py', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("seed.py updated with precise woman-specific fashion URLs.")
