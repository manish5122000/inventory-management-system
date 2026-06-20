from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.customers.schemas import (
    CustomerCreate,
    CustomerUpdate
)

from app.customers import service


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/")
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db)
):
    return service.create_customer(
        db,
        payload
    )


@router.get("/")
def get_customers(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return service.get_customers(db, page, limit)


@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return service.get_customer(
        db,
        customer_id
    )


@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    payload: CustomerUpdate,
    db: Session = Depends(get_db)
):
    return service.update_customer(
        db,
        customer_id,
        payload
    )


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_customer(
        db,
        customer_id
    )