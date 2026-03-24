import os
import sys

try:
    import main
    print("Main module imported successfully")
except Exception as e:
    print(f"Error importing main module: {e}")
    import traceback
    traceback.print_exc()

try:
    from main import app
    print("FastAPI app instance found")
except Exception as e:
    print(f"Error getting app from main: {e}")
