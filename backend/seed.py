import os
from sqlmodel import Session, create_engine, SQLModel
from models import Product

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def seed_db():
    print("Dropping existing tables to apply new schema...")
    SQLModel.metadata.drop_all(engine)
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    
    products_data = [
        {
            "name": "Camiseta Blanca Clásica",
            "price": 45.00,
            "category": "Tops",
            "description": "La camiseta blanca perfecta. Algodón premium, corte relajado y durabilidad excepcional. Un básico imprescindible.",
            "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=800",
            "sizes": "S, M, L, XL",
            "colors": "Blanco, Negro",
            "stock": 10
        },
        {
            "name": "Jean Wide Leg",
            "price": 120.00,
            "category": "Pantalones",
            "description": "Denim de alto gramaje con corte ancho moderno. Lavado vintage y detalles distressed hechos a mano.",
            "image_url": "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
            "sizes": "28, 30, 32, 34",
            "colors": "Azul Claro, Azul Oscuro",
            "stock": 15
        },
        {
            "name": "Buzo Oversize",
            "price": 85.00,
            "category": "Abrigos",
            "description": "Hoodie oversize en felpa francesa. Comodidad absoluta con un estilo urbano definido.",
            "image_url": "https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800",
            "sizes": "S, M, L, XL",
            "colors": "Único",
            "stock": 8
        },
        {
            "name": "Botas de Cuero",
            "price": 180.00,
            "category": "Calzado",
            "description": "Botas de cuero genuino hechas a mano. Suela resistente y diseño atemporal.",
            "image_url": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&q=80&w=800",
            "sizes": "39, 40, 41, 42, 43",
            "colors": "Café, Negro",
            "stock": 5
        },
        {
            "name": "Corredor Urbano",
            "price": 120.00,
            "category": "Calzado",
            "description": "Zapatillas deportivas con tecnología de amortiguación para un confort excepcional en la ciudad.",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
            "sizes": "38, 39, 40, 41, 42",
            "colors": "Negro, Gris",
            "stock": 12
        },
        {
            "name": "Urbano Alto",
            "price": 150.00,
            "category": "Calzado",
            "description": "Estilo urbano sofisticado con corte alto. Combinación perfecta entre moda y funcionalidad.",
            "image_url": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=800",
            "sizes": "38, 39, 40, 41, 42",
            "colors": "Negro, Blanco",
            "stock": 6
        },
        {
            "name": "Clásico Bajo",
            "price": 95.00,
            "category": "Calzado",
            "description": "El clásico que nunca falla. Zapatillas bajas versátiles para cualquier ocasión.",
            "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
            "sizes": "38, 39, 40, 41, 42",
            "colors": "Blanco, Rojo",
            "stock": 20
        },
        {
            "name": "Elite Deportiva",
            "price": 180.00,
            "category": "Calzado",
            "description": "Rendimiento superior con diseño vanguardista. Para quienes exigen lo mejor en cada paso.",
            "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
            "sizes": "38, 39, 40, 41, 42",
            "colors": "Negro, Verde",
            "stock": 4
        },
        {
            "name": "Lona Pro",
            "price": 80.00,
            "category": "Calzado",
            "description": "Zapatillas de lona duraderas con suela vulcanizada. Comodidad clásica para el día a día.",
            "image_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800",
            "sizes": "38, 39, 40, 41, 42",
            "colors": "Rojo, Blanco",
            "stock": 18
        },
        {
            "name": "Vestido Midi Floral",
            "price": 95.00,
            "category": "Vestidos",
            "description": "Vestido midi con estampado floral, ideal para un look fresco y femenino. Tela ligera y caída perfecta.",
            "image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
            "sizes": "S, M, L",
            "colors": "Estampado Floral",
            "stock": 7
        },
        {
            "name": "Vestido Satinado Noche",
            "price": 135.00,
            "category": "Vestidos",
            "description": "Vestido de satén elegante para ocasiones especiales. Diseño minimalista con tirantes finos.",
            "image_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
            "sizes": "S, M, L",
            "colors": "Negro, Esmeralda",
            "stock": 5
        },
        {
            "name": "Pantalón Cargo Beige",
            "price": 110.00,
            "category": "Pantalones",
            "description": "Pantalón cargo de tiro alto con bolsillos laterales. Comodidad y estilo urbano en un solo diseño.",
            "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
            "image2_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
            "sizes": "26, 28, 30, 32",
            "colors": "Beige, Caqui",
            "stock": 11
        }
    ]
    with Session(engine) as session:
        for p in products_data:
            prod = Product(**p)
            session.add(prod)
        session.commit()
        print("Database seeded successfully with", len(products_data), "products.")

if __name__ == "__main__":
    seed_db()
