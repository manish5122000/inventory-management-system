from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.exceptions import global_exception_handler

from app.products.router import router as product_router
from app.customers.router import router as customer_router
from app.orders.router import router as order_router
from app.dashboard.router import router as dashboard_router


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

frontend_url = getattr(
       settings.FRONTEND_URL
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
           settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)

app.add_exception_handler(
    Exception,
    global_exception_handler
)


@app.get("/")
@limiter.limit("10/minute")
async def root(request: Request):
    return {
        "message": "Inventory Management API Running"
    }


@app.get("/health")
@limiter.limit("30/minute")
async def health(request: Request):
    return {
        "status": "healthy"
    }