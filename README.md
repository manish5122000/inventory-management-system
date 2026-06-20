# Inventory & Order Management System

A Inventory Management System built with React, FastAPI, PostgreSQL, and Docker.

## Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: React (JavaScript), Vite
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git

## Features

### Product Management
- Create, read, update, and delete products
- Track product SKU, price, and stock quantity
- SKU validation (must be unique)
- Stock quantity validation (cannot be negative)

### Customer Management
- Create, read, update, and delete customers
- Track customer name, email, and phone
- Email validation (must be unique)

### Order Management
- Create orders with multiple products
- View all orders and order details
- Automatic stock reduction on order creation
- Inventory validation (cannot place orders with insufficient stock)
- Automatic total amount calculation

### Dashboard
- Summary statistics (total products, customers, orders)
- Low stock alerts
- Recent orders overview

## Prerequisites

- Docker
- Docker Compose
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inventory-management-system
```

### 2. Environment Configuration

#### Backend
Copy the example environment file:
```bash
cp backend/.env
```

The backend `.env` file should contain:
```
DATABASE_URL=postgresql+psycopg2://postgres:your_secure_password@postgres:5432/inventory_db
APP_NAME=Inventory Management System
APP_VERSION=1.0.0
```

#### Frontend
Copy the example environment file:
```bash
cp frontend/.env
```

The frontend `.env` file should contain:
```
VITE_API_URL=http://localhost:8000
```

### 3. Start the Application with Docker Compose

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Start FastAPI backend on port 8000
- Start React frontend on port 80

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## API Endpoints

### Products
- `POST /products` - Create a new product
- `GET /products` - Retrieve all products
- `GET /products/{id}` - Retrieve a specific product
- `PUT /products/{id}` - Update product details
- `DELETE /products/{id}` - Delete a product

### Customers
- `POST /customers` - Create a new customer
- `GET /customers` - Retrieve all customers
- `GET /customers/{id}` - Retrieve a specific customer
- `PUT /customers/{id}` - Update customer details
- `DELETE /customers/{id}` - Delete a customer

### Orders
- `POST /orders` - Create a new order
- `GET /orders` - Retrieve all orders
- `GET /orders/{id}` - Retrieve order details
- `DELETE /orders/{id}` - Delete an order

### Dashboard
- `GET /dashboard/summary` - Get dashboard statistics

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Docker Configuration

The project uses multi-stage builds for optimized production images:

- **Backend**: Python 3.12 slim image
- **Frontend**: Node 20 Alpine for build, Nginx Alpine for serving
- **Database**: PostgreSQL 16

Environment variables are configured in `docker-compose.yml` for seamless container orchestration.

## Business Logic Rules

1. Product SKU must be unique
2. Customer email must be unique
3. Product quantity cannot be negative
4. Orders cannot be placed if inventory is insufficient
5. Creating an order automatically reduces available stock
6. Total order amount is calculated automatically by the backend
7. All APIs include proper error handling with appropriate HTTP status codes
8. All request data is validated before processing


