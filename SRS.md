# Software Requirements Specification (SRS)

## 1. Project Overview

### 1.1 Project Name
E-Commerce Backend API

### 1.2 Project Type
RESTful API Backend Service

### 1.3 Core Functionality
A full-featured e-commerce backend system enabling user authentication, product management, shopping cart operations, and order processing with Razorpay payment integration.

### 1.4 Target Users
- **End Users**: Customers who browse products, add to cart, and place orders
- **Admin Users**: Store administrators who manage products and view all orders

---

## 2. Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Payment Gateway | Razorpay |
| API Style | RESTful |

---

## 3. User Roles

| Role | Description |
|------|-------------|
| USER | Standard customer - can browse products, manage cart, place orders |
| ADMIN | Administrator - can create, update, delete products, view all orders |

---

## 4. Functional Requirements

### 4.1 User Management

#### 4.1.1 User Registration
- **FR-U1**: Users can register with name, email, and password
- **FR-U2**: Email must be unique across the system
- **FR-U3**: Default role assigned is "USER"

#### 4.1.2 User Login
- **FR-U4**: Registered users can login with email and password
- **FR-U5**: Successful login returns a JWT token
- **FR-U6**: Token must be included in subsequent authenticated requests

#### 4.1.3 User Profile
- **FR-U7**: Authenticated users can view their profile information

---

### 4.2 Product Management

#### 4.2.1 Product Listing
- **FR-P1**: All users can view list of all products
- **FR-P2**: Products can be searched by name and description (text search)
- **FR-P3**: Each product displays: name, description, price, stock, category

#### 4.2.2 Product Details
- **FR-P4**: Users can view individual product details by ID

#### 4.2.3 Product CRUD (Admin Only)
- **FR-P5**: Admins can create new products
- **FR-P6**: Admins can update existing products
- **FR-P7**: Admins can delete products

---

### 4.3 Shopping Cart

#### 4.3.1 Add to Cart
- **FR-C1**: Authenticated users can add products to their cart
- **FR-C2**: Users can specify quantity when adding items
- **FR-C3**: Adding the same product increases quantity instead of creating duplicate entry

#### 4.3.2 View Cart
- **FR-C4**: Authenticated users can view their cart with all items
- **FR-C5**: Cart displays product details and quantities

#### 4.3.3 Remove from Cart
- **FR-C6**: Authenticated users can remove specific items from cart

---

### 4.4 Order Management

#### 4.4.1 Order Creation
- **FR-O1**: Authenticated users can create orders from their cart
- **FR-O2**: Order creation generates a Razorpay order for payment
- **FR-O3**: Order includes all cart items with current prices
- **FR-O4**: Total amount is calculated from cart items

#### 4.4.2 Order Status
- **FR-O5**: Orders have status: PENDING → CONFIRMED → SHIPPED → DELIVERED
- **FR-O6**: Orders can be CANCELLED

#### 4.4.3 Payment
- **FR-O7**: Razorpay integration for payment processing
- **FR-O8**: Payment verification endpoint validates payment signature
- **FR-O9**: Payment status tracked: UNPAID, PAID, FAILED

#### 4.4.4 Order History
- **FR-O10**: Users can view their own order history
- **FR-O11**: Admins can view all orders in the system

---

## 5. Data Models

### 5.1 User
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required, Trimmed |
| email | String | Required, Unique, Lowercase |
| password | String | Required |
| role | String | Enum: USER, ADMIN, Default: USER |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### 5.2 Product
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required, Trimmed |
| description | String | Required |
| price | Number | Required |
| stock | Number | Required |
| category | String | Required |
| createdBy | ObjectId | Reference to User, Required |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### 5.3 Cart
| Field | Type | Constraints |
|-------|------|-------------|
| user | ObjectId | Reference to User, Unique |
| items | Array | CartItem objects |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

**CartItem:**
| Field | Type | Constraints |
|-------|------|-------------|
| product | ObjectId | Reference to Product, Required |
| quantity | Number | Required, Min: 1 |

### 5.4 Order
| Field | Type | Constraints |
|-------|------|-------------|
| user | ObjectId | Reference to User, Required |
| items | Array | OrderItem objects |
| totalAmount | Number | Required |
| status | String | Enum: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED |
| razorpayOrderId | String | - |
| razorpayPaymentId | String | - |
| razorpaySignature | String | - |
| paymentStatus | String | Enum: UNPAID, PAID, FAILED |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

**OrderItem:**
| Field | Type | Constraints |
|-------|------|-------------|
| product | ObjectId | Reference to Product, Required |
| quantity | Number | Required |
| price | Number | Required |

---

## 6. API Endpoints Summary

### 6.1 Authentication
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | /api/v1/users/register | Register new user | No | - |
| POST | /api/v1/users/login | User login | No | - |
| GET | /api/v1/users/profile | Get user profile | Yes | USER, ADMIN |

### 6.2 Products
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/products | Get all products | No | - |
| GET | /api/v1/products/:id | Get product by ID | No | - |
| POST | /api/v1/products | Create product | Yes | ADMIN |
| PUT | /api/v1/products/:id | Update product | Yes | ADMIN |
| DELETE | /api/v1/products/:id | Delete product | Yes | ADMIN |

### 6.3 Cart
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | /api/v1/cart | Get user cart | Yes | USER, ADMIN |
| POST | /api/v1/cart | Add to cart | Yes | USER, ADMIN |
| DELETE | /api/v1/cart/:productId | Remove from cart | Yes | USER, ADMIN |

### 6.4 Orders
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | /api/v1/orders | Create order | Yes | USER, ADMIN |
| GET | /api/v1/orders/my-orders | Get my orders | Yes | USER, ADMIN |
| GET | /api/v1/orders | Get all orders | Yes | ADMIN |
| POST | /api/v1/orders/verify | Verify payment | Yes | USER, ADMIN |

---

## 7. Security Requirements

- **SEC-1**: Passwords must be stored securely (hashed)
- **SEC-2**: All authenticated routes require valid JWT token
- **SEC-3**: Admin routes are protected with role-based access control
- **SEC-4**: Payment verification uses cryptographic signature validation

---

## 8. Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| Performance | API should respond within reasonable time (< 2s for typical operations) |
| Scalability | System should handle multiple concurrent users |
| Reliability | MongoDB transactions ensure data consistency |
| Maintainability | Modular MVC architecture for easy maintenance |

---

## 9. Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/             # Configuration files
│   │   └── razorpay.js     # Razorpay config
│   ├── middleware/        # Middleware functions
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── modules/            # Feature modules
│   │   ├── user/
│   │   ├── product/
│   │   ├── cart/
│   │   └── order/
│   └── utils/              # Utility functions
└── package.json
```

---

## 10. Future Enhancements (Out of Scope)

- Email notifications
- Order tracking
- Product categories management
- Review and ratings
- Wishlist functionality
- Multiple payment gateways

