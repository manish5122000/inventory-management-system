from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.products.schemas import (
    ProductCreate,
    ProductUpdate
)

from app.products import service


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/")
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.create_product(
        db,
        payload
    )


@router.get("/")
def get_products(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return service.get_products(db, page, limit)




@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return service.get_product(
        db,
        product_id
    )


@router.put("/{product_id}")
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db)
):
    return service.update_product(
        db,
        product_id,
        payload
    )


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_product(
        db,
        product_id
    )