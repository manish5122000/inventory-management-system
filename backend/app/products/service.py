from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.products.models import Product
from app.products.schemas import ProductCreate, ProductUpdate


def create_product(db: Session, payload: ProductCreate):
    existing = (
        db.query(Product)
        .filter(Product.sku == payload.sku)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    product = Product(**payload.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def get_products(
    db: Session,
    page: int = 1,
    limit: int = 10
):
    offset = (page - 1) * limit

    products = (
        db.query(Product)
        .offset(offset)
        .limit(limit)
        .all()
    )

    total = db.query(Product).count()

    return {
        "data": products,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }


def get_product(
    db: Session,
    product_id: int
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


def update_product(
    db: Session,
    product_id: int,
    payload: ProductUpdate
):
    product = get_product(db, product_id)

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "sku" in update_data:
        existing = (
            db.query(Product)
            .filter(
                Product.sku == update_data["sku"],
                Product.id != product_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="SKU already exists"
            )

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product_id: int
):
    product = get_product(db, product_id)

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }