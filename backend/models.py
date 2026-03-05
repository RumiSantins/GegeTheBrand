from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field

class Product(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    category: str = Field(default="General")
    description: Optional[str] = None
    price: float
    stock: int = Field(default=0)
    sizes: Optional[str] = None
    colors: Optional[str] = None
    image_url: Optional[str] = None
    image2_url: Optional[str] = None
