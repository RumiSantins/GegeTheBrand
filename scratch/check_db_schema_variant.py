import sqlite3

def check_columns():
    conn = sqlite3.connect('backend/database.db')
    cursor = conn.cursor()
    
    print("Columns in 'productvariant' table:")
    cursor.execute("PRAGMA table_info(productvariant)")
    for col in cursor.fetchall():
        print(col)
        
    conn.close()

if __name__ == "__main__":
    check_columns()
