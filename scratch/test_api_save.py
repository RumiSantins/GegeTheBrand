import requests
import json

API_BASE_URL = "http://localhost:8080"

# 1. Login to get token
# Note: form-encoded login as per OAuth2PasswordRequestForm
login_payload = {"username": "admin", "password": "password123"}
res = requests.post(f"{API_BASE_URL}/login", data=login_payload)
if res.status_code == 200:
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 2. Get first product
    res = requests.get(f"{API_BASE_URL}/products")
    products = res.json()
    if products:
        # Find a product that has variants
        product = next((p for p in products if p.get("variants")), products[0])
        product_id = product["id"]
        
        # 3. Try to update variants with a fake image_url
        new_variants = [
            {
                "size": "TestSize",
                "color": "TestColor",
                "stock": 99,
                "color_hex": "#FF0000",
                "image_url": "/static/uploads/persist_test.jpg"
            }
        ]
        
        payload = {
            "name": product["name"],
            "price": product["price"],
            "description": product.get("description", ""),
            "category": product.get("category", "General"),
            "variants": new_variants
        }
        
        print(f"Sending PUT to /admin/products/{product_id}")
        res = requests.put(f"{API_BASE_URL}/admin/products/{product_id}", headers=headers, json=payload)
        print(f"Response Status: {res.status_code}")
        if res.status_code == 200:
            print("Update Success!")
            # 4. Verify in DB via a NEW request
            res = requests.get(f"{API_BASE_URL}/products")
            updated_products = res.json()
            updated_product = next((p for p in updated_products if p["id"] == product_id), None)
            if updated_product:
                print("Verifying variants in response...")
                for v in updated_product.get("variants", []):
                    print(f"Variant: {v.get('size')} - {v.get('color')}, Image: {v.get('image_url')}")
            else:
                print("Could not find product in list after update")
        else:
            print(f"Update failed: {res.text}")
else:
    print(f"Login failed: {res.text}")
