from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Employee(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    dni: str = Field(index=True, unique=True)
    name: str
    first_name: str = Field(default="")
    last_name: str = Field(default="")
    username: Optional[str] = Field(default=None, unique=True, index=True)
    password_hash: Optional[str] = None
    is_registered: bool = Field(default=False)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

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
    announcement_text: str = Field(default="ENVÍO GRATIS EN COMPRAS MAYORES A $150  •  NUEVA COLECCIÓN DISPONIBLE  •  DESCUENTOS EXCLUSIVOS PARA MIEMBROS")

class EditorialSettings(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    bg_text: str = Field(default="Muse")
    title_line1: str = Field(default="LA")
    title_italic: str = Field(default="NUEVA")
    title_gradient: str = Field(default="POÉTICA")
    description: str = Field(default="Redefiniendo la feminidad a través de líneas puras y texturas que cuentan historias de libertad y elegancia atemporal.")
    quote_text: str = Field(default="La elegancia es la única belleza que nunca desaparece.")
    quote_author: str = Field(default="Audrey Hepburn")
    look_name: str = Field(default="Conjunto Minimal Seda")
    look_price: str = Field(default="S/ 185")
    button_url: str = Field(default="/#shop")
    image_1_url: str = Field(default="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")
    image_2_url: str = Field(default="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop")
    image_main_url: str = Field(default="https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=1974&auto=format&fit=crop")
    image_3_url: str = Field(default="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop")
    image_4_url: str = Field(default="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop")
    image_5_url: str = Field(default="https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1964&auto=format&fit=crop")

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
    color_hex: Optional[str] = Field(default="#FFFFFF")
    stock: int = Field(default=0)
    image_url: Optional[str] = None
    
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
    related_product_id: Optional[UUID] = Field(default=None)
    
    is_offer: bool = Field(default=False)
    offer_price: Optional[float] = None
    offer_min_qty: int = Field(default=1)
    
    size_guide_url: Optional[str] = None

class Order(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    order_number: str = Field(index=True)  # Like a short reference
    customer_info: str  # Could store basic stringified info if needed, or leave it mostly for whatsapp parsing
    total_amount: float
    amount_paid: float = Field(default=0.0)
    payment_method: str = Field(default="Efectivo")
    status: str = Field(default="Pendiente") # Pendiente, Completada, Cancelada, Devuelta
    created_at: str # Simple ISO string timestamp
    managed_by: Optional[str] = Field(default=None)
    managed_by_name: Optional[str] = Field(default=None)
    
    items: List["OrderItem"] = Relationship(back_populates="order", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class OrderItem(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    order_id: UUID = Field(foreign_key="order.id")
    product_id: UUID = Field(foreign_key="product.id")
    variant_id: Optional[UUID] = Field(foreign_key="productvariant.id", default=None)
    
    product_name: str
    size: str
    quantity: int
    price_at_time: float
    is_offer: bool = Field(default=False)
    
    order: "Order" = Relationship(back_populates="items")
