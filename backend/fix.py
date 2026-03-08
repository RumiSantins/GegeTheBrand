with open('seed.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
cat = None
for line in lines:
    if line.strip().startswith('"category":'):
        cat = line.split('"')[3]
    if line.strip().startswith('"images":') and cat:
        indent = line.split('"')[0]
        if cat == 'Tops':
            out_lines.append(f'{indent}"images": \'["/static/uploads/top.png"]\',\n')
        elif cat == 'Pantalones':
            out_lines.append(f'{indent}"images": \'["/static/uploads/jeans.png"]\',\n')
        elif cat == 'Abrigos':
            out_lines.append(f'{indent}"images": \'["/static/uploads/coat.png"]\',\n')
        elif cat == 'Calzado':
            out_lines.append(f'{indent}"images": \'["/static/uploads/sneakers.png"]\',\n')
        elif cat == 'Vestidos':
            out_lines.append(f'{indent}"images": \'["/static/uploads/dress.png"]\',\n')
        else:
            out_lines.append(line)
        cat = None
        continue
    out_lines.append(line)

with open('seed.py', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("seed.py updated with static AI local files.")
