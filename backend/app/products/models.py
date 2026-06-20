from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    sku = Column(
        String,
        unique=True,
        nullable=False
    )

    price = Column(Float, nullable=False)

    stock_quantity = Column(
        Integer,
        default=0
    )

    order_items = relationship(
        "OrderItem",
        back_populates="product"
    )