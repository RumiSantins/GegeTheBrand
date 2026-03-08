from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class Category(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    image_url: Optional[str] = None

class Manifesto(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    subtitle: str = Field(default="Nuestro Manifiesto")
    title_line1: str = Field(default="Diseñamos para la")
    title_highlight: str = Field(default="mujer real")
    title_line2: str = Field(default="la que inspira.")
    bg_text_1: str = Field(default="GEGE")
    bg_text_2: str = Field(default="THE BRAND")
    principle_1_title: str = Field(default="Elegancia")
    principle_1_desc: str = Field(default="La belleza en la simplicidad.")
    principle_2_title: str = Field(default="Autenticidad")
    principle_2_desc: str = Field(default="Viste tu verdad cada día.")
    principle_3_title: str = Field(default="Fuerza")
    principle_3_desc: str = Field(default="Empoderamiento a través del estilo.")
    quote: str = Field(default='"Gege the Brand nace de la necesidad de celebrar la individualidad femenina. Piezas que no solo visten, sino que acompañan."')
    image_1_url: str = Field(default="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop")
    image_2_url: str = Field(default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop")

class SiteSettings(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    shop_title: str = Field(default="TIENDA")
    shop_description: str = Field(default="Descubre nuestra última colección. Piezas diseñadas con atención al detalle y materiales de primera calidad.")

class HeroSlide(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    image_url: str
    title: str
    subtitle: str
    cta_text: str
    cta_url: Optional[str] = None

class ProductVariant(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    product_id: UUID = Field(foreign_key="product.id")
    size: str
    color: str
    stock: int = Field(default=0)
    
    product: "Product" = Relationship(back_populates="variants")

class Product(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    category: str = Field(default="General")
    description: Optional[str] = None
    price: float
    
    # We will store multiple images as a JSON string (e.g. '["url1", "url2"]')
    images: Optional[str] = Field(default="[]")
    
    # Optional shortcut columns if needed, though variants will hold the real data
    sizes: Optional[str] = None
    colors: Optional[str] = None
    
    variants: List[ProductVariant] = Relationship(back_populates="product", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
