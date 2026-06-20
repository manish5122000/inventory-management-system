from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.customers.models import Customer
from app.customers.schemas import CustomerCreate
from app.customers.schemas import CustomerUpdate


def create_customer(
    db: Session,
    payload: CustomerCreate
):

    existing = (
        db.query(Customer)
        .filter(Customer.email == payload.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    customer = Customer(**payload.model_dump())

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def get_customers(db: Session, page: int = 1, limit: int = 10):
    offset = (page - 1) * limit
    
    total = db.query(func.count(Customer.id)).scalar()
    customers = db.query(Customer).offset(offset).limit(limit).all()
    total_pages = (total + limit - 1) // limit
    
    return {
        "data": customers,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }


def get_customer(
    db: Session,
    customer_id: int
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


def update_customer(
    db: Session,
    customer_id: int,
    payload: CustomerUpdate
):

    customer = get_customer(
        db,
        customer_id
    )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "email" in update_data:
        existing = (
            db.query(Customer)
            .filter(
                Customer.email == update_data["email"],
                Customer.id != customer_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

    for key, value in update_data.items():
        setattr(customer, key, value)

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(
    db: Session,
    customer_id: int
):

    customer = get_customer(
        db,
        customer_id
    )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }