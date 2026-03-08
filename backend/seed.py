import os
from sqlmodel import Session, create_engine, SQLModel
from models import Product, ProductVariant, Category, HeroSlide

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def seed_db():
    print("Dropping existing tables to apply new schema...")
    SQLModel.metadata.drop_all(engine)
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    
    products_data = [
        # TOPS
        {
            "name": "Camiseta Básica Premium",
            "price": 45.00,
            "category": "Tops",
            "description": "Nuestra camiseta blanca más vendida. Algodón orgánico súper suave, corte relajado y durabilidad excepcional. Un básico imprescindible para cualquier guardarropa.",
            "images": '["/static/uploads/top.png"]',
            "variants": [
                {"size": "S", "color": "Blanco", "stock": 15},
                {"size": "M", "color": "Blanco", "stock": 25},
                {"size": "L", "color": "Negro", "stock": 10}
            ]
        },
        {
            "name": "Crop Top Deportivo",
            "price": 29.99,
            "category": "Tops",
            "description": "Crop top ajustado ideal para entrenar o salir. Tela transpirable y elástica.",
            "images": '["/static/uploads/top.png"]',
            "variants": [
                {"size": "XS", "color": "Rosa", "stock": 5},
                {"size": "S", "color": "Rosa", "stock": 8},
                {"size": "M", "color": "Negro", "stock": 10}
            ]
        },
        {
            "name": "Blusa Elegante de Seda",
            "price": 85.00,
            "category": "Tops",
            "description": "Blusa de seda con caída perfecta. Mangas abullonadas y cuello en V.",
            "images": '["/static/uploads/top.png"]',
            "variants": [
                {"size": "S", "color": "Beige", "stock": 3},
                {"size": "M", "color": "Beige", "stock": 4},
                {"size": "M", "color": "Esmeralda", "stock": 2}
            ]
        },
        {
            "name": "Sudadera Oversize con Capucha",
            "price": 65.00,
            "category": "Tops",
            "description": "La sudadera más cómoda que tendrás. Interior de tejido polar y ajuste oversize.",
            "images": '["/static/uploads/top.png"]',
            "variants": [
                {"size": "M", "color": "Gris", "stock": 20},
                {"size": "L", "color": "Gris", "stock": 15},
                {"size": "XL", "color": "Gris", "stock": 5}
            ]
        },
        {
            "name": "Camisa Denim Vintage",
            "price": 55.00,
            "category": "Tops",
            "description": "Camisa vaquera con lavado vintage y botones a presión. Un clásico renovado.",
            "images": '["/static/uploads/top.png"]',
            "variants": [
                {"size": "S", "color": "Azul Medio", "stock": 8},
                {"size": "M", "color": "Azul Medio", "stock": 12},
                {"size": "L", "color": "Azul Medio", "stock": 7}
            ]
        },

        # PANTALONES
        {
            "name": "Jean Wide Leg 90s",
            "price": 120.00,
            "category": "Pantalones",
            "description": "Denim de alto gramaje con corte ancho inspirado en los 90s. Lavado vintage.",
            "images": '["/static/uploads/jeans.png"]',
            "variants": [
                {"size": "28", "color": "Azul Claro", "stock": 10},
                {"size": "30", "color": "Azul Claro", "stock": 5},
                {"size": "32", "color": "Azul Oscuro", "stock": 8}
            ]
        },
        {
            "name": "Pantalón de Lino Recto",
            "price": 75.00,
            "category": "Pantalones",
            "description": "Pantalón fresco de lino 100%. Corte recto y cintura elástica para máxima comodidad.",
            "images": '["/static/uploads/jeans.png"]',
            "variants": [
                {"size": "S", "color": "Arena", "stock": 15},
                {"size": "M", "color": "Arena", "stock": 12},
                {"size": "L", "color": "Blanco", "stock": 8}
            ]
        },
        {
            "name": "Leggings Sculpting",
            "price": 45.00,
            "category": "Pantalones",
            "description": "Leggings de compresión media que esculpen la figura. Perfectos para el gimnasio o el día a día.",
            "images": '["/static/uploads/jeans.png"]',
            "variants": [
                {"size": "S", "color": "Negro", "stock": 30},
                {"size": "M", "color": "Negro", "stock": 25},
                {"size": "L", "color": "Azul Marino", "stock": 10}
            ]
        },
        {
            "name": "Pantalón Cargo Urbano",
            "price": 89.99,
            "category": "Pantalones",
            "description": "Estilo urbano con múltiples bolsillos funcionales. Tela resistente y bajo ajustable.",
            "images": '["/static/uploads/jeans.png"]',
            "variants": [
                {"size": "30", "color": "Verde Oliva", "stock": 6},
                {"size": "32", "color": "Verde Oliva", "stock": 14},
                {"size": "34", "color": "Negro", "stock": 9}
            ]
        },
        {
            "name": "Pantalón Sastre Holgado",
            "price": 95.00,
            "category": "Pantalones",
            "description": "Pantalón sastre reinventado. Silueta suelta y elegante con pinzas frontales.",
            "images": '["/static/uploads/jeans.png"]',
            "variants": [
                {"size": "36", "color": "Gris Jaspeado", "stock": 5},
                {"size": "38", "color": "Gris Jaspeado", "stock": 4},
                {"size": "40", "color": "Negro", "stock": 2}
            ]
        },

        # ABRIGOS
        {
            "name": "Trench Coat Clásico",
            "price": 185.00,
            "category": "Abrigos",
            "description": "Gabardina icónica resistente al agua con cinturón ajustable y forro de tartán.",
            "images": '["/static/uploads/coat.png"]',
            "variants": [
                {"size": "S", "color": "Beige Clásico", "stock": 4},
                {"size": "M", "color": "Beige Clásico", "stock": 6},
                {"size": "L", "color": "Negro", "stock": 3}
            ]
        },
        {
            "name": "Casaca de Cuero Biker",
            "price": 250.00,
            "category": "Abrigos",
            "description": "Chaqueta de cuero genuino estilo motociclista. Cierres metálicos asimétricos y ajuste entallado.",
            "images": '["/static/uploads/coat.png"]',
            "variants": [
                {"size": "S", "color": "Negro", "stock": 5},
                {"size": "M", "color": "Negro", "stock": 3},
                {"size": "L", "color": "Negro", "stock": 1}
            ]
        },
        {
            "name": "Abrigo de Lana Minimalista",
            "price": 195.00,
            "category": "Abrigos",
            "description": "Corte estructurado y elegante en una mezcla de lana premium. Perfecto para el invierno.",
            "images": '["/static/uploads/coat.png"]',
            "variants": [
                {"size": "M", "color": "Camel", "stock": 7},
                {"size": "L", "color": "Camel", "stock": 4},
                {"size": "XL", "color": "Gris", "stock": 5}
            ]
        },
        {
            "name": "Chaqueta Puffer Acolchada",
            "price": 140.00,
            "category": "Abrigos",
            "description": "Máximo calor sin peso. Relleno sostenible y acabado repelente al agua.",
            "images": '["/static/uploads/coat.png"]',
            "variants": [
                {"size": "S", "color": "Rojo", "stock": 8},
                {"size": "M", "color": "Rojo", "stock": 10},
                {"size": "L", "color": "Azul Marino", "stock": 12}
            ]
        },
        {
            "name": "Blazer Oversize Boyfriend",
            "price": 110.00,
            "category": "Abrigos",
            "description": "El blazer perfecto para elevar cualquier look casual. Hombros estructurados y corte amplio.",
            "images": '["/static/uploads/coat.png"]',
            "variants": [
                {"size": "S", "color": "Negro", "stock": 6},
                {"size": "M", "color": "Negro", "stock": 8},
                {"size": "L", "color": "Cuadros", "stock": 4}
            ]
        },

        # CALZADO
        {
            "name": "Zapatillas Chunky Urbanas",
            "price": 135.00,
            "category": "Calzado",
            "description": "Suela robusta y diseño retro-futurista. Súper cómodas para caminar todo el día.",
            "images": '["/static/uploads/sneakers.png"]',
            "variants": [
                {"size": "38", "color": "Blanco/Rojo", "stock": 12},
                {"size": "39", "color": "Blanco/Rojo", "stock": 15},
                {"size": "40", "color": "Blanco/Rojo", "stock": 8}
            ]
        },
        {
            "name": "Botines Chelsea de Cuero",
            "price": 160.00,
            "category": "Calzado",
            "description": "Elegantes y versátiles. Paneles elásticos laterales y tira en el talón para fácil calce.",
            "images": '["/static/uploads/sneakers.png"]',
            "variants": [
                {"size": "39", "color": "Negro", "stock": 5},
                {"size": "40", "color": "Negro", "stock": 7},
                {"size": "41", "color": "Marrón", "stock": 4}
            ]
        },
        {
            "name": "Mocasines Clásicos",
            "price": 115.00,
            "category": "Calzado",
            "description": "Un básico atemporal para el trabajo o el fin de semana. Antifaz frontal tradicional.",
            "images": '["/static/uploads/sneakers.png"]',
            "variants": [
                {"size": "37", "color": "Burdeos", "stock": 3},
                {"size": "38", "color": "Burdeos", "stock": 6},
                {"size": "39", "color": "Negro", "stock": 9}
            ]
        },
        {
            "name": "Sandalias de Tiras",
            "price": 85.00,
            "category": "Calzado",
            "description": "Ligeras y elegantes. Tacón bajo cuadrado perfecto para el verano.",
            "images": '["/static/uploads/sneakers.png"]',
            "variants": [
                {"size": "36", "color": "Beige", "stock": 10},
                {"size": "37", "color": "Beige", "stock": 12},
                {"size": "38", "color": "Plata", "stock": 5}
            ]
        },
        {
            "name": "Zapatillas de Lona",
            "price": 60.00,
            "category": "Calzado",
            "description": "El clásico zapato de skate. Lona resistente, suela de goma vulcanizada.",
            "images": '["/static/uploads/sneakers.png"]',
            "variants": [
                {"size": "39", "color": "Blanco", "stock": 20},
                {"size": "40", "color": "Blanco", "stock": 25},
                {"size": "41", "color": "Blanco", "stock": 15}
            ]
        },

        # VESTIDOS
        {
            "name": "Vestido Midi de Lino",
            "price": 130.00,
            "category": "Vestidos",
            "description": "Vestido fresco de tirantes con detalles de botones en el frente y abertura lateral.",
            "images": '["/static/uploads/dress.png"]',
            "variants": [
                {"size": "S", "color": "Blanco", "stock": 8},
                {"size": "M", "color": "Blanco", "stock": 10},
                {"size": "L", "color": "Mostaza", "stock": 4}
            ]
        },
        {
            "name": "Slip Dress de Satén",
            "price": 95.00,
            "category": "Vestidos",
            "description": "Elegancia noventera en tejido satinado con caída fluida. Escote fluido y tirantes finos.",
            "images": '["/static/uploads/dress.png"]',
            "variants": [
                {"size": "XS", "color": "Esmeralda", "stock": 3},
                {"size": "S", "color": "Esmeralda", "stock": 6},
                {"size": "M", "color": "Negro", "stock": 12}
            ]
        },
        {
            "name": "Vestido Camisero Estampado",
            "price": 115.00,
            "category": "Vestidos",
            "description": "Para la oficina o el brunch. Estampado geométrico sutil y cinturón para marcar figura.",
            "images": '["/static/uploads/dress.png"]',
            "variants": [
                {"size": "M", "color": "Azul/Blanco", "stock": 7},
                {"size": "L", "color": "Azul/Blanco", "stock": 5},
                {"size": "XL", "color": "Rayas Rojas", "stock": 3}
            ]
        },
        {
            "name": "Vestido LBD Clásico",
            "price": 145.00,
            "category": "Vestidos",
            "description": "El essential de cualquier fondo de armario. Cuello barco y largo por la rodilla.",
            "images": '["/static/uploads/dress.png"]',
            "variants": [
                {"size": "S", "color": "Negro", "stock": 10},
                {"size": "M", "color": "Negro", "stock": 15},
                {"size": "L", "color": "Negro", "stock": 10}
            ]
        },
        {
            "name": "Vestido Floral Maxi",
            "price": 165.00,
            "category": "Vestidos",
            "description": "Diseño romántico de largo completo con estampado floral. Mangas japonesas y escote en V.",
            "images": '["/static/uploads/dress.png"]',
            "variants": [
                {"size": "S", "color": "Floral Claro", "stock": 4},
                {"size": "M", "color": "Floral Claro", "stock": 6},
                {"size": "M", "color": "Floral Oscuro", "stock": 5}
            ]
        }
    ]
    with Session(engine) as session:
        for p in products_data:
            variants_data = p.pop("variants", [])
            prod = Product(**p)
            session.add(prod)
            session.flush() # get product ID
            for v_data in variants_data:
                v_data["product_id"] = prod.id
                v_obj = ProductVariant(**v_data)
                session.add(v_obj)
        session.commit()
        print("Database seeded successfully with", len(products_data), "products.")

    with Session(engine) as session:
        print("Creating categories...")
        categories_data = [
            {"name": "ABRIGOS | BLAZER | JACKET", "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400"},
            {"name": "BLUSAS", "image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400"},
            {"name": "BÁSICOS", "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400"},
            {"name": "CALZADOS", "image_url": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=400"},
            {"name": "FALDAS Y SHORT", "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400"},
            {"name": "PANTALONES", "image_url": "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=400"},
            {"name": "SUÉTERES Y TEJIDOS", "image_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=400"},
            {"name": "TOPS", "image_url": "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=400"},
            {"name": "Vestidos", "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400"}
        ]
        for c_data in categories_data:
            session.add(Category(**c_data))
        
        session.commit()
        print("Categories seeded successfully with", len(categories_data), "items.")

    with Session(engine) as session:
        print("Creating hero slides...")
        hero_slides_data = [
            {
                "image_url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
                "title": "NUEVA COLECCIÓN 2026",
                "subtitle": "Elegancia minimalista para el día a día.",
                "cta_text": "VER COLECCIÓN"
            },
            {
                "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
                "title": "DENIM EXCLUSIVO",
                "subtitle": "La reinvención del clásico.",
                "cta_text": "COMPRAR DENIM"
            },
            {
                "image_url": "https://images.unsplash.com/photo-1550614000-4b9519e0034a?q=80&w=2073&auto=format&fit=crop",
                "title": "ESENCIALES URBANOS",
                "subtitle": "Diseños que marcan tendencia.",
                "cta_text": "DESCUBRIR MÁS"
            }
        ]
        for h_data in hero_slides_data:
            session.add(HeroSlide(**h_data))
        
        session.commit()
        print("Hero slides seeded successfully with", len(hero_slides_data), "items.")

if __name__ == "__main__":
    seed_db()
