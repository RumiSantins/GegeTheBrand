import os
import shutil
from typing import List
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, create_engine, Session, select
from models import Product

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

# --- 5. RUTAS CRUD PROTEGIDAS E INVENTARIO ---

@app.get("/products", response_model=List[Product])
def get_products(session: Session = Depends(get_session)):
    products = session.exec(select(Product)).all()
    return products

@app.post("/admin/products", response_model=Product)
def create_product(
    product: Product, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@app.delete("/admin/products/{product_id}")
def delete_product(
    product_id: str, 
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"message": "Producto eliminado exitosamente"}

@app.put("/admin/products/{product_id}", response_model=Product)
def update_product(
    product_id: str,
    product_data: dict,
    session: Session = Depends(get_session),
    admin: dict = Depends(get_current_admin)
):
    # Using dict for product_data to avoid id override issues during parsing
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product_data.items():
        if hasattr(db_product, key) and key != "id":
            setattr(db_product, key, value)
            
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product
