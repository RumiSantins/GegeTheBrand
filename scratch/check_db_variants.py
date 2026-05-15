import sqlite3
import json

conn = sqlite3.connect('backend/database.db')
cursor = conn.cursor()

print("--- Product Variants ---")
cursor.execute("PRAGMA table_info(productvariant)")
columns = cursor.fetchall()
for col in columns:
    print(col)

cursor.execute("SELECT * FROM productvariant")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
