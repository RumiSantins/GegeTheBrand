from sqlmodel import Session, create_engine, select
from models import Category

engine = create_engine("sqlite:///database.db")

def list_categories():
    with Session(engine) as session:
        categories = session.exec(select(Category)).all()
        for cat in categories:
            print(f"'{cat.name}'")

if __name__ == "__main__":
    list_categories()
