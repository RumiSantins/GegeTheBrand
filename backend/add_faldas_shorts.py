import json
from sqlmodel import Session, create_engine, select
from models import Product, ProductVariant, Category
from uuid import uuid4

engine = create_engine("sqlite:///database.db")

def add_placeholders():
    category_name = "FALDAS/SHORT"
    
    products_to_add = [
        {
            "name": "Falda Midi de Satén",
            "price": 115.00,
            "description": "Falda midi con acabado satinado y caída fluida. Perfecta para un look elegante y sofisticado.",
            "images": '["https://loremflickr.com/800/1200/woman,satin,skirt?lock=201"]'
        },
        {
            "name": "Short de Lino Relax",
            "price": 85.00,
            "description": "Short de lino fresco con cintura elástica y bolsillos laterales. Ideal para días calurosos.",
            "images": '["https://loremflickr.com/800/1200/woman,linen,shorts?lock=202"]'
        },
        {
            "name": "Falda Mini de Tablas",
            "price": 95.00,
            "description": "Falda mini con diseño de tablas clásicas. Un toque juvenil y versátil para tu outfit.",
            "images": '["https://loremflickr.com/800/1200/woman,skirt,fashion?lock=203"]'
        },
        {
            "name": "Bermuda Sastrera",
            "price": 110.00,
            "description": "Bermuda de corte sastrero con pinzas. Elegancia y comodidad para un estilo urbano moderno.",
            "images": '["https://loremflickr.com/800/1200/woman,bermuda,fashion?lock=204"]'
        }
    ]

    with Session(engine) as session:
        # Check if category exists
        statement = select(Category).where(Category.name == category_name)
        category = session.exec(statement).first()
        if not category:
            category = Category(name=category_name)
            session.add(category)
            session.commit()
            session.refresh(category)
            print(f"Created category: {category_name}")

        for p_data in products_to_add:
            # Check if product already exists to avoid duplicates
            check_stmt = select(Product).where(Product.name == p_data["name"])
            existing = session.exec(check_stmt).first()
            if existing:
                print(f"Product '{p_data['name']}' already exists. Skipping.")
                continue

            product = Product(
                id=uuid4(),
                name=p_data["name"],
                category=category_name,
                price=p_data["price"],
                description=p_data["description"],
                images=p_data["images"]
            )
            session.add(product)
            session.flush() # get product.id

            # Add variants
            for size in ["S", "M", "L"]:
                variant = ProductVariant(
                    id=uuid4(),
                    product_id=product.id,
                    size=size,
                    color="Único",
                    color_hex="#E0E0E0",
                    stock=10
                )
                session.add(variant)
            
            print(f"Added product: {product.name}")

        session.commit()
    print("Done adding placeholders.")

if __name__ == "__main__":
    add_placeholders()
