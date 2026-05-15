import sqlite3

def check_columns():
    conn = sqlite3.connect('backend/database.db')
    cursor = conn.cursor()
    
    print("Columns in 'product' table:")
    cursor.execute("PRAGMA table_info(product)")
    for col in cursor.fetchall():
        print(col)
        
    print("\nColumns in 'orderitem' table:")
    cursor.execute("PRAGMA table_info(orderitem)")
    for col in cursor.fetchall():
        print(col)
        
    conn.close()

if __name__ == "__main__":
    check_columns()
