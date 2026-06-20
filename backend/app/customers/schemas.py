from pydantic import BaseModel, EmailStr
from typing import Optional


class CustomerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str

    class Config:
        from_attributes = True