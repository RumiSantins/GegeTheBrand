import os
import shutil
import json
import uuid
import jwt
from typing import List, Optional
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, create_engine, Session, select, text
from sqlalchemy.orm import selectinload
from passlib.context import CryptContext
from dotenv import load_dotenv
from models import Product, ProductVariant, Category, HeroSlide, Manifesto, SiteSettings, EditorialSettings, Order, OrderItem
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


load_dotenv()

# Security Configuration labels from .env
SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
ADMIN_USERNAME_ENV = os.getenv("ADMIN_USERNAME", "admin").strip().strip('"')
ADMIN_PASSWORD_HASH_ENV = os.getenv("ADMIN_PASSWORD_HASH", "").strip().strip('"')

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# Configuración de BD SQLite
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        try:
            session.exec(text("ALTER TABLE productvariant ADD COLUMN color_hex VARCHAR DEFAULT '#FFFFFF'"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE sitesettings ADD COLUMN announcement_text VARCHAR DEFAULT 'ENVÍO GRATIS EN COMPRAS MAYORES A $150  •  NUEVA COLECCIÓN DISPONIBLE  •  DESCUENTOS EXCLUSIVOS PARA MIEMBROS'"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE editorialsettings ADD COLUMN button_url VARCHAR DEFAULT '/#shop'"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE `order` ADD COLUMN amount_paid FLOAT DEFAULT 0.0"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE `order` ADD COLUMN payment_method VARCHAR DEFAULT 'Efectivo'"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE product ADD COLUMN related_product_id CHAR(32)"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE productvariant ADD COLUMN image_url VARCHAR"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE product ADD COLUMN is_offer BOOLEAN DEFAULT 0"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE product ADD COLUMN offer_price FLOAT"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE orderitem ADD COLUMN is_offer BOOLEAN DEFAULT 0"))
            session.commit()
        except:
            session.rollback()

        try:
            session.exec(text("ALTER TABLE product ADD COLUMN offer_min_qty INTEGER DEFAULT 1"))
            session.commit()
        except:
            session.rollback()

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas al iniciar
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Outgoing response: {response.status_code}")
    return response

# --- 1. CONFIGURACIÓN CORS ---
# Usamos una lista explícita para compatibilidad con allow_credentials=True
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://34.176.8.184:3000",
    "https://gegethebrand.com",
    "https://www.gegethebrand.com",
    "http://gegethebrand.com",
    "http://www.gegethebrand.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Exception handlers to ensure CORS headers are present even on errors
from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    origin = request.headers.get("origin")
    headers = {}
    if origin in origins or "*" in origins:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=headers
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    headers = {}
    if origin in origins or "*" in origins:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=headers
    )

# --- 2. SERVIR ARCHIVOS ESTÁTICOS ---
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- 3. SEGURIDAD (JWT & PASSWORD HASHING) ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == ADMIN_USERNAME_ENV and verify_password(form_data.password, ADMIN_PASSWORD_HASH_ENV):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": form_data.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Usuario o contraseña incorrectos",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username != ADMIN_USERNAME_ENV:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas o expiradas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"username": username, "role": "admin"}
    except (jwt.PyJWTError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

# --- 4. GESTIÓN DE ARCHIVOS (IMÁGENES) ---
@app.post("/admin/upload-image")
async def upload_image(
    file: UploadFile = File(...), 
    admin: dict = Depends(get_current_admin)
):
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif", ".svg", ".bmp", ".tiff"}
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    
    is_image_type = file.content_type and file.content_type.startswith("image/")
    is_allowed_ext = ext in allowed_extensions
    
    if not (is_image_type or is_allowed_ext):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    safe_filename = f"{uuid.uuid4().hex}{ext}"
    file_location = f"static/uploads/{safe_filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    return {"url": f"/static/uploads/{safe_filename}"}

# --- 5. CATEGORY ENDPOINTS ---

@app.get("/categories")
def get_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    return categories

@app.post("/admin/categories")
def create_category(
    category_data: dict, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    category = Category(**category_data)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@app.put("/admin/categories/{category_id}")
def update_category(
    category_id: str,
    category_data: dict,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if "name" in category_data:
        category.name = category_data["name"]
    if "image_url" in category_data:
        category.image_url = category_data["image_url"]
        
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@app.delete("/admin/categories/{category_id}")
def delete_category(
    category_id: str, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    session.delete(category)
    session.commit()
    return {"ok": True}


# --- 5.1 MANIFESTO ENDPOINTS ---

@app.get("/manifesto")
def get_manifesto(session: Session = Depends(get_session)):
    manifesto = session.exec(select(Manifesto)).first()
    if not manifesto:
        manifesto = Manifesto()
        session.add(manifesto)
        session.commit()
        session.refresh(manifesto)
    return manifesto

@app.put("/admin/manifesto")
def update_manifesto(
    data: dict, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    manifesto = session.exec(select(Manifesto)).first()
    if not manifesto:
        manifesto = Manifesto()
        session.add(manifesto)

    for key, value in data.items():
        if hasattr(manifesto, key) and key != "id":
            setattr(manifesto, key, value)

    session.commit()
    session.refresh(manifesto)
    return manifesto

# --- 5.2 SITE SETTINGS ENDPOINTS ---

@app.get("/site-settings")
def get_site_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(SiteSettings)).first()
    if not settings:
        settings = SiteSettings()
        session.add(settings)
        session.commit()
        session.refresh(settings)
    return settings

@app.put("/admin/site-settings")
def update_site_settings(
    data: dict, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    settings = session.exec(select(SiteSettings)).first()
    if not settings:
        settings = SiteSettings()
        session.add(settings)

    for key, value in data.items():
        if hasattr(settings, key) and key != "id":
            setattr(settings, key, value)

    session.commit()
    session.refresh(settings)
    return settings


# --- 5.3 EDITORIAL SETTINGS ENDPOINTS ---

@app.get("/editorial-settings")
def get_editorial_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(EditorialSettings)).first()
    if not settings:
        settings = EditorialSettings()
        session.add(settings)
        session.commit()
        session.refresh(settings)
    return settings

@app.put("/admin/editorial-settings")
def update_editorial_settings(
    data: dict, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    settings = session.exec(select(EditorialSettings)).first()
    if not settings:
        settings = EditorialSettings()
        session.add(settings)

    for key, value in data.items():
        if hasattr(settings, key) and key != "id":
            setattr(settings, key, value)

    session.commit()
    session.refresh(settings)
    return settings


# --- 6. HERO SLIDER ENDPOINTS ---

@app.get("/hero-slides")
def get_hero_slides(session: Session = Depends(get_session)):
    slides = session.exec(select(HeroSlide)).all()
    return slides

@app.post("/admin/hero-slides")
def create_hero_slide(
    slide_data: dict, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    slide = HeroSlide(**slide_data)
    session.add(slide)
    session.commit()
    session.refresh(slide)
    return slide

@app.put("/admin/hero-slides/{slide_id}")
def update_hero_slide(
    slide_id: str,
    slide_data: dict,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    slide = session.get(HeroSlide, slide_id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
        
    for key, value in slide_data.items():
        if hasattr(slide, key):
            setattr(slide, key, value)
            
    session.add(slide)
    session.commit()
    session.refresh(slide)
    return slide

@app.delete("/admin/hero-slides/{slide_id}")
def delete_hero_slide(
    slide_id: str, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    slide = session.get(HeroSlide, slide_id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    session.delete(slide)
    session.commit()
    return {"ok": True}


# --- 7. PRODUCT ENDPOINTS ---

@app.get("/products")
def get_products(session: Session = Depends(get_session)):
    stmt = select(Product).options(selectinload(Product.variants))
    products = session.exec(stmt).all()
    # Serialize variants into the response
    result = []
    for p in products:
        p_dict = p.model_dump()
        p_dict["variants"] = [v.model_dump() for v in p.variants]
        result.append(p_dict)
    return result

@app.post("/admin/products")
def create_product(
    product_data: dict, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    variants_data = product_data.pop("variants", [])
    
    # Check if images are passed as an array
    if "images" in product_data and isinstance(product_data["images"], list):
        product_data["images"] = json.dumps(product_data["images"])
        
    product = Product(**product_data)
    session.add(product)
    session.commit()
    session.refresh(product)
    
    for v_data in variants_data:
        v_data["product_id"] = product.id
        variant = ProductVariant(**v_data)
        session.add(variant)
        
    session.commit()
    session.refresh(product)
    
    res = product.model_dump()
    res["variants"] = [v.model_dump() for v in product.variants]
    return res

@app.delete("/admin/products/{product_id}")
def delete_product(
    product_id: str, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    stmt = select(Product).where(Product.id == product_id).options(selectinload(Product.variants))
    product = session.exec(stmt).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"message": "Producto eliminado exitosamente"}

@app.put("/admin/products/{product_id}")
def update_product(
    product_id: str,
    product_data: dict,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    stmt = select(Product).where(Product.id == product_id).options(selectinload(Product.variants))
    db_product = session.exec(stmt).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    variants_data = product_data.pop("variants", None)
    
    if "images" in product_data and isinstance(product_data["images"], list):
        product_data["images"] = json.dumps(product_data["images"])
    
    for key, value in product_data.items():
        if hasattr(db_product, key) and key != "id":
            setattr(db_product, key, value)
            
    # Update variants if provided
    if variants_data is not None:
        logger.info(f"Updating variants for product {product_id}. Count: {len(variants_data)}")
        
        # We'll clear the current variants. Since we have cascade="all, delete-orphan",
        # assigning an empty list will delete them from the DB on commit.
        db_product.variants = []
        
        for v_data in variants_data:
            # Prepare data: remove ID and ensure product_id is correct
            v_data.pop("id", None)
            v_data["product_id"] = db_product.id
            
            # Create new variant object
            # We filter the keys to ensure we only pass what's in the model
            # This avoids errors if the frontend sends extra fields like 'image_preview'
            allowed_keys = ["product_id", "size", "color", "color_hex", "stock", "image_url"]
            filtered_data = {k: v for k, v in v_data.items() if k in allowed_keys}
            
            new_variant = ProductVariant(**filtered_data)
            db_product.variants.append(new_variant)
            
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    
    # Load correctly after refresh
    stmt = select(Product).where(Product.id == product_id).options(selectinload(Product.variants))
    final_db_product = session.exec(stmt).first()
    
    res = final_db_product.model_dump()
    res["variants"] = [v.model_dump() for v in final_db_product.variants]
    
    return res

# --- 8. ORDERS ENDPOINTS ---

@app.post("/orders")
def create_order(
    order_data: dict, 
    session: Session = Depends(get_session)
):
    items_data = order_data.pop("items", [])
    
    # Generate short order number
    now = datetime.now()
    order_number = f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    order_data["order_number"] = order_number
    order_data["created_at"] = now.isoformat()
    order_data["status"] = "Pendiente"
    
    order = Order(**order_data)
    session.add(order)
    session.commit()
    session.refresh(order)
    
    for item in items_data:
        item["order_id"] = order.id
        if not item.get("variant_id"):
            item["variant_id"] = None
        if not item.get("is_offer"):
            item["is_offer"] = False
        order_item = OrderItem(**item)
        session.add(order_item)
        
    session.commit()
    session.refresh(order)
    
    return {"order_number": order.order_number, "id": str(order.id), "amount_paid": order.amount_paid, "payment_method": order.payment_method}

@app.get("/admin/orders")
def get_orders(
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    stmt = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())
    orders = session.exec(stmt).all()
    
    result = []
    for o in orders:
        o_dict = o.model_dump()
        o_dict["id"] = str(o_dict["id"])
        o_dict["items"] = []
        for i in o.items:
            i_dict = i.model_dump()
            i_dict["id"] = str(i_dict["id"])
            i_dict["order_id"] = str(i_dict["order_id"])
            i_dict["product_id"] = str(i_dict["product_id"])
            if i_dict.get("variant_id"):
                i_dict["variant_id"] = str(i_dict["variant_id"])
            o_dict["items"].append(i_dict)
        result.append(o_dict)
    return result

@app.get("/admin/orders/{order_id}")
def get_order(
    order_id: str,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    stmt = select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    order = session.exec(stmt).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    o_dict = order.model_dump()
    o_dict["id"] = str(o_dict["id"])
    o_dict["items"] = []
    for i in order.items:
        i_dict = i.model_dump()
        i_dict["id"] = str(i_dict["id"])
        i_dict["order_id"] = str(i_dict["order_id"])
        i_dict["product_id"] = str(i_dict["product_id"])
        if i_dict.get("variant_id"):
            i_dict["variant_id"] = str(i_dict["variant_id"])
        o_dict["items"].append(i_dict)
        
    return o_dict

@app.put("/admin/orders/{order_id}/status")
def update_order_status(
    order_id: str,
    status_data: dict,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    stmt = select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    order = session.exec(stmt).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    new_status = status_data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing status")

    old_status = order.status
    
    # If transitioning to Completada from something else
    if new_status == "Completada" and old_status != "Completada":
        for item in order.items:
            if item.variant_id:
                variant = session.get(ProductVariant, item.variant_id)
                if variant:
                    variant.stock = max(0, variant.stock - item.quantity)
                    session.add(variant)
    
    # If transitioning from Completada to Cancelada or Devuelta
    elif old_status == "Completada" and new_status in ["Cancelada", "Devuelta"]:
        for item in order.items:
            if item.variant_id:
                variant = session.get(ProductVariant, item.variant_id)
                if variant:
                    variant.stock += item.quantity
                    session.add(variant)
                    
    order.status = new_status
    session.add(order)
    session.commit()
    
    return {"message": "Estado actualizado", "status": new_status}

@app.put("/admin/orders/{order_id}")
def update_order_details(
    order_id: str,
    order_data: dict,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    stmt = select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    order = session.exec(stmt).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    items_data = order_data.pop("items", None)
    
    if "customer_info" in order_data:
        order.customer_info = order_data["customer_info"]

    # If items are being modified, handle inventory math if order is already "Completada"
    if items_data is not None:
        # Step 1: Temporarily reverse the stock if the order was Completada
        if order.status == "Completada":
            for item in order.items:
                if item.variant_id:
                    variant = session.get(ProductVariant, item.variant_id)
                    if variant:
                        variant.stock += item.quantity
                        session.add(variant)
            # Must commit the reversal before we change the items
            session.commit()
            
        # Step 2: Delete old items
        for item in order.items:
            session.delete(item)
        session.commit()
        
        # Step 3: Add new items
        new_total = 0
        for item_data in items_data:
            item_data.pop("id", None) # remove id if exists
            item_data["order_id"] = order.id
            if not item_data.get("variant_id"):
                item_data["variant_id"] = None
                
            qty = item_data.get("quantity", 1)
            price = item_data.get("price_at_time", 0.0)
            new_total += (qty * price)
            
            new_item = OrderItem(**item_data)
            session.add(new_item)
            
        order.total_amount = new_total
        if "amount_paid" in order_data:
            order.amount_paid = float(order_data["amount_paid"])
        if "payment_method" in order_data:
            order.payment_method = order_data["payment_method"]
        session.add(order)
        session.commit()
        
        # Reload order with items
        stmt = select(Order).where(Order.id == order_id).options(selectinload(Order.items))
        order = session.exec(stmt).first()

        # Step 4: Re-apply stock reduction if order is still Completada
        if order.status == "Completada":
            for item in order.items:
                if item.variant_id:
                    variant = session.get(ProductVariant, item.variant_id)
                    if variant:
                        variant.stock = max(0, variant.stock - item.quantity)
                        session.add(variant)
            session.commit()
            
    else:
        # If no items provided, just update the main order details
        session.add(order)
        session.commit()
        
    session.refresh(order)
    
    # Reload for response
    stmt = select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    final_order = session.exec(stmt).first()
    
    res = final_order.model_dump()
    res["id"] = str(res["id"])
    res["items"] = []
    for i in final_order.items:
        i_dict = i.model_dump()
        i_dict["id"] = str(i_dict["id"])
        i_dict["order_id"] = str(i_dict["order_id"])
        i_dict["product_id"] = str(i_dict["product_id"])
        if i_dict.get("variant_id"):
            i_dict["variant_id"] = str(i_dict["variant_id"])
        res["items"].append(i_dict)
        
    return res
