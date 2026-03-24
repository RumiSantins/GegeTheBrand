import os
import sys

# Mocking FastAPI for a moment if needed
from typing import Optional
from datetime import timedelta

try:
    import main
    print("Main module imported successfully")
    
    # Try calling create_db_and_tables
    print("Calling create_db_and_tables...")
    main.create_db_and_tables()
    print("create_db_and_tables finished successfully")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
