from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db

from app.products.models import Product
from app.customers.models import Customer
from app.orders.models import Order


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):

    total_products = (
        db.query(func.count(Product.id))
        .scalar()
    )

    total_customers = (
        db.query(func.count(Customer.id))
        .scalar()
    )

    total_orders = (
        db.query(func.count(Order.id))
        .scalar()
    )

    low_stock_products_list = (
        db.query(Product)
        .filter(Product.stock_quantity < 5)
        .all()
    )

    low_stock_products_count = len(low_stock_products_list)

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": low_stock_products_count,
        "low_stock_products_list": low_stock_products_list
    }