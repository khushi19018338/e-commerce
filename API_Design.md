# API Design Document

## E-Commerce Backend API

---

## 1. API Overview

| Property | Value |
|----------|-------|
| Base URL | `http://localhost:5000/api/v1` |
| Protocol | HTTP/HTTPS |
| Data Format | JSON |
| Authentication | JWT (Bearer Token) |
| Content-Type | `application/json` |

---

## 2. API Endpoints Summary

### 2.1 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user | No |
| POST | `/users/login` | User login | No |
| GET | `/users/profile` | Get user profile | Yes |

### 2.2 Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get product by ID | No |
| POST | `/products` | Create product | Yes (Admin) |
| PUT | `/products/:id` | Update product | Yes (Admin) |
| DELETE | `/products/:id` | Delete product | Yes (Admin) |

### 2.3 Cart Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart` | Add to cart | Yes |
| DELETE | `/cart/:productId` | Remove from cart | Yes |

### 2.4 Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order | Yes |
| GET | `/orders/my-orders` | Get my orders | Yes |
| GET | `/orders` | Get all orders | Yes (Admin) |
| POST | `/orders/verify` | Verify payment | Yes |

---

## 3. Authentication

### 3.1 Authentication Header
All protected endpoints require the following header:
```
Authorization: Bearer <JWT_TOKEN>
```

### 3.2 JWT Token Payload
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "USER" | "ADMIN"
}
```

---

## 4. User Endpoints

### 4.1 Register User
**Endpoint:** `POST /users/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4.2 Login User
**Endpoint:** `POST /users/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 4.3 Get User Profile
**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Protected route accessed",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication invalid"
}
```

---

## 5. Product Endpoints

### 5.1 Get All Products
**Endpoint:** `GET /products`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| search | string | Search by name/description | - |
| category | string | Filter by category | - |
| page | number | Page number | 1 |
| limit | number | Items per page | 10 |

**Example:** `GET /products?search=phone&category=electronics&page=1&limit=10`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone with A17 chip",
      "price": 999,
      "stock": 50,
      "category": "electronics",
      "createdBy": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Samsung Galaxy S24",
      "description": "Premium Android smartphone",
      "price": 899,
      "stock": 30,
      "category": "electronics",
      "createdBy": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-14T09:00:00.000Z",
      "updatedAt": "2024-01-14T09:00:00.000Z"
    }
  ]
}
```

---

### 5.2 Get Product by ID
**Endpoint:** `GET /products/:id`

**Example:** `GET /products/507f1f77bcf86cd799439011`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with A17 chip",
    "price": 999,
    "stock": 50,
    "category": "electronics",
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 5.3 Create Product (Admin Only)
**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "name": "MacBook Pro M3",
  "description": "Powerful laptop with M3 chip",
  "price": 1999,
  "stock": 25,
  "category": "laptops"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "MacBook Pro M3",
    "description": "Powerful laptop with M3 chip",
    "price": 1999,
    "stock": 25,
    "category": "laptops",
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access forbidden"
}
```

---

### 5.4 Update Product (Admin Only)
**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "name": "MacBook Pro M3 (Updated)",
  "price": 1899,
  "stock": 30
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "MacBook Pro M3 (Updated)",
    "description": "Powerful laptop with M3 chip",
    "price": 1899,
    "stock": 30,
    "category": "laptops",
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

---

### 5.5 Delete Product (Admin Only)
**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 6. Cart Endpoints

### 6.1 Get Cart
**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "iPhone 15 Pro",
          "description": "Latest iPhone with A17 chip",
          "price": 999,
          "category": "electronics"
        },
        "quantity": 2
      },
      {
        "product": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "MacBook Pro M3",
          "description": "Powerful laptop with M3 chip",
          "price": 1999,
          "category": "laptops"
        },
        "quantity": 1
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

---

### 6.2 Add to Cart
**Endpoint:** `POST /cart`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 6.3 Remove from Cart
**Endpoint:** `DELETE /cart/:productId`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example:** `DELETE /cart/507f1f77bcf86cd799439011`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## 7. Order Endpoints

### 7.1 Create Order
**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 999
      }
    ],
    "totalAmount": 1998,
    "status": "PENDING",
    "razorpayOrderId": "order_1234567890",
    "paymentStatus": "UNPAID",
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

---

### 7.2 Get My Orders
**Endpoint:** `GET /orders/my-orders`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "iPhone 15 Pro"
          },
          "quantity": 2,
          "price": 999
        }
      ],
      "totalAmount": 1998,
      "status": "PENDING",
      "paymentStatus": "UNPAID",
      "createdAt": "2024-01-15T15:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439014",
            "name": "MacBook Pro M3"
          },
          "quantity": 1,
          "price": 1999
        }
      ],
      "totalAmount": 1999,
      "status": "DELIVERED",
      "paymentStatus": "PAID",
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 7.3 Get All Orders (Admin Only)
**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "iPhone 15 Pro"
          },
          "quantity": 2,
          "price": 999
        }
      ],
      "totalAmount": 1998,
      "status": "PENDING",
      "paymentStatus": "UNPAID",
      "createdAt": "2024-01-15T15:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439018",
      "user": {
        "_id": "507f1f77bcf86cd799439019",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439014",
            "name": "MacBook Pro M3"
          },
          "quantity": 1,
          "price": 1999
        }
      ],
      "totalAmount": 1999,
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "createdAt": "2024-01-14T12:00:00.000Z"
    }
  ]
}
```

---

### 7.4 Verify Payment
**Endpoint:** `POST /orders/verify`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "razorpayOrderId": "order_1234567890",
  "razorpayPaymentId": "pay_1234567890",
  "razorpaySignature": "abc123def456..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "razorpayPaymentId": "pay_1234567890",
    "razorpaySignature": "abc123def456..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid payment signature"
}
```

---

## 8. Error Responses

### 8.1 Standard Error Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### 8.2 HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### 8.3 Common Error Messages

| Status | Message |
|--------|---------|
| 400 | "Invalid request body" |
| 400 | "Product not found" |
| 400 | "Insufficient stock" |
| 401 | "Authentication invalid" |
| 401 | "Invalid credentials" |
| 403 | "Access forbidden" |
| 404 | "Route not found" |
| 500 | "Internal server error" |

---

## 9. API Versioning

- Current Version: **v1**
- Base Path: `/api/v1`
- Future versions will follow: `/api/v2`, etc.

---

## 10. Request/Response Flow Diagrams

### 10.1 Authentication Flow
```
┌──────────┐                                          ┌─────────────┐
│  Client  │                                          │   Server    │
└────┬─────┘                                          └──────┬──────┘
     │                                                      │
     │ 1. POST /api/v1/users/register                      │
     │ {name, email, password}                             │
     ├────────────────────────────────────────────────────►│
     │                                                      │
     │                              2. Validate & Hash     │
     │                              3. Save to MongoDB     │
     │                                                      │
     │ 4. Generate JWT                                     │
     │ 5. Return {user, token}                            │
     │◄────────────────────────────────────────────────────┤
     │                                                      │
```

### 10.2 Order Creation Flow
```
┌──────────┐                     ┌─────────────┐       ┌──────────┐
│  Client  │                     │   Server    │       │ Razorpay │
└────┬─────┘                     └──────┬──────┘       └────┬─────┘
     │                                   │                  │
     │ 1. POST /api/v1/orders            │                  │
     │ {items}                           │                  │
     ├──────────────────────────────────►│                  │
     │                                   │                  │
     │ 2. Verify JWT                     │                  │
     │ 3. Get cart items                 │                  │
     │ 4. Calculate total                │                  │
     │                                   │                  │
     │                 5. Create Razorpay Order             │
     │                                   ├─────────────────►│
     │                                   │                  │
     │                                   │ 6. razorpayOrderId│
     │                                   │◄──────────────────┤
     │                                   │                  │
     │ 7. Create Order in MongoDB        │                  │
     │ 8. Return {order, razorpayOrderId}                  │
     │◄──────────────────────────────────┤                  │
```

---

## 11. Testing Examples

### 11.1 Register User (cURL)
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 11.2 Login (cURL)
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 11.3 Get Products (cURL)
```bash
curl -X GET http://localhost:5000/api/v1/products
```

### 11.4 Create Order (cURL)
```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 2
      }
    ]
  }'
```

---

## 12. Summary

| Module | Endpoints | Authentication |
|--------|-----------|----------------|
| Users | 3 | JWT |
| Products | 5 | JWT (Admin for write) |
| Cart | 3 | JWT |
| Orders | 4 | JWT |
| **Total** | **15** | |

This API follows RESTful conventions and uses standard HTTP methods and status codes.

