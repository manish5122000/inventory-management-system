from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.orders.models import Order
from app.orders.models import OrderItem

from app.products.models import Product
from app.customers.models import Customer

from app.orders.schemas import OrderCreate


def create_order(
    db: Session,
    payload: OrderCreate
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == payload.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0

    order = Order(
        customer_id=payload.customer_id
    )

    db.add(order)
    db.flush()

    for item in payload.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        subtotal = (
            item.quantity * product.price
        )

        total_amount += subtotal

        product.stock_quantity -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price,
            subtotal=subtotal
        )

        db.add(order_item)

    order.total_amount = total_amount

    db.commit()
    db.refresh(order)

    return order


def get_orders(
    db: Session,
    page: int = 1,
    limit: int = 10
):

    offset = (page - 1) * limit

    total = db.query(
        func.count(Order.id)
    ).scalar()

    orders = (
        db.query(Order)
        .options(
            joinedload(Order.customer)
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    total_pages = (
        total + limit - 1
    ) // limit

    return {
        "data": [
            {
                "id": order.id,
                "customer_id": order.customer_id,
                "customer_name": f"{order.customer.full_name}",
                "total_amount": order.total_amount,
                "created_at": order.created_at
            }
            for order in orders
        ],
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }


def get_order(
    db: Session,
    order_id: int
):

    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.order_items)
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


def delete_order(
    db: Session,
    order_id: int
):

    order = get_order(
        db,
        order_id
    )

    db.delete(order)

    db.commit()

    return {
        "message": "Order deleted successfully"
    }