from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.orders.schemas import OrderCreate, OrderResponse

from app.orders import service


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/")
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db)
):
    return service.create_order(
        db,
        payload
    )


@router.get("/")
def get_orders(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return service.get_orders(db, page, limit)


@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = service.get_order(
        db,
        order_id
    )

    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": f"{order.customer.full_name}",
        "created_at": order.created_at,
        "total_amount": order.total_amount,
        "order_items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.subtotal
            }
            for item in order.order_items
        ]
    }

@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_order(
        db,
        order_id
    )