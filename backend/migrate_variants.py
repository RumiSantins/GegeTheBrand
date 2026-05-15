import sqlite3

try:
    conn = sqlite3.connect('backend/database.db')
    cursor = conn.cursor()
    cursor.execute('ALTER TABLE productvariant ADD COLUMN image_url VARCHAR')
    conn.commit()
    print("Column image_url added successfully to productvariant")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("Column image_url already exists")
    else:
        print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
