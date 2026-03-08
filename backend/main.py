import os
import shutil
from typing import List
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy.orm import selectinload
import json
from models import Product, ProductVariant, Category, HeroSlide, Manifesto, SiteSettings

# Configuración de BD SQLite
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas al iniciar
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# --- 1. CONFIGURACIÓN CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. SERVIR ARCHIVOS ESTÁTICOS ---
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- 3. SEGURIDAD (JWT DEPENDENCY BÁSICA) ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Credenciales de prueba
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "password123"

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == ADMIN_USERNAME and form_data.password == ADMIN_PASSWORD:
        # En producción, usa PyJWT para generar un token real
        return {"access_token": "fake-jwt-token-for-admin-demo", "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Usuario o contraseña incorrectos",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_current_admin(token: str = Depends(oauth2_scheme)):
    # Validación simple para demo
    if token != "fake-jwt-token-for-admin-demo":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": ADMIN_USERNAME, "role": "admin"}

# --- 4. GESTIÓN DE ARCHIVOS (IMÁGENES) ---
@app.post("/admin/upload-image")
async def upload_image(
    file: UploadFile = File(...), 
    admin: dict = Depends(get_current_admin)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

    file_location = f"static/uploads/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    return {"url": f"/static/uploads/{file.filename}"}

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
        # Simplest approach: Delete existing variants and re-create them
        for v in db_product.variants:
            session.delete(v)
        session.commit() # commit deletion
        
        for v_data in variants_data:
            v_data.pop("id", None) # remove id if exists from frontend to create new
            v_data["product_id"] = db_product.id
            new_variant = ProductVariant(**v_data)
            session.add(new_variant)
            
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    
    # Load correctly after refresh
    stmt = select(Product).where(Product.id == product_id).options(selectinload(Product.variants))
    final_db_product = session.exec(stmt).first()
    
    res = final_db_product.model_dump()
    res["variants"] = [v.model_dump() for v in final_db_product.variants]
    
    return res
