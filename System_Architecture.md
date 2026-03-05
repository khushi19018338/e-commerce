# System Architecture

## E-Commerce Backend API

---

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT LAYER                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   Browser   │  │ Mobile App  │  │  Web App    │  │ 3rd Party   │                  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │
└─────────┼────────────────┼────────────────┼────────────────┼──────────────────────────┘
          │                │                │                │
          │    HTTPS/REST API (JSON)         │                │
          │                │                │                │
┌─────────▼────────────────▼────────────────▼────────────────▼──────────────────────────┐
│                                   SERVER LAYER                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           EXPRESS.JS APPLICATION                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│  │  │   Users     │  │  Products  │  │    Cart     │  │   Orders    │             │   │
│  │  │   Module    │  │   Module   │  │   Module    │  │   Module    │             │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │   │
│  │         │                │                │                │                    │   │
│  │         └────────────────┴────────────────┴────────────────┘                    │   │
│  │                                    │                                              │   │
│  │                          ┌─────────▼─────────┐                                    │   │
│  │                          │   Middleware     │                                    │   │
│  │                          │  - Auth (JWT)    │                                    │   │
│  │                          │  - Error Handler │                                    │   │
│  │                          └─────────┬─────────┘                                    │   │
│  └────────────────────────────────────┼────────────────────────────────────────────┘   │
└───────────────────────────────────────┼─────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATA LAYER                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │    MongoDB          │  │    Razorpay         │  │    Environment      │             │
│  │    (Database)       │  │    (Payment Gateway)│  │    Variables        │             │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Layers

### 2.1 Client Layer (Presentation)
| Component | Description |
|-----------|-------------|
| Browser | Web frontend consuming REST API |
| Mobile App | Native mobile applications |
| 3rd Party | External services integrating with API |

### 2.2 Server Layer (Application)
```
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS.JS SERVER                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      ROUTING LAYER                               │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │  │ /api/v1/   │ │ /api/v1/   │ │ /api/v1/   │ │ /api/v1/   │   │  │
│  │  │   users    │ │ products   │ │   cart     │ │  orders    │   │  │
│  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘   │  │
│  └────────┼──────────────┼──────────────┼──────────────┼──────────┘  │
│           │              │              │              │              │
│  ┌────────▼──────────────▼──────────────▼──────────────▼──────────┐  │
│  │                    CONTROLLER LAYER                              │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │  │   User     │ │  Product   │ │   Cart     │ │   Order    │   │  │
│  │  │ Controller │ │ Controller │ │ Controller │ │ Controller │   │  │
│  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘   │  │
│  └────────┼──────────────┼──────────────┼──────────────┼──────────┘  │
│           │              │              │              │              │
│  ┌────────▼──────────────▼──────────────▼──────────────▼──────────┐  │
│  │                     SERVICE LAYER                               │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │  │   User     │ │  Product   │ │   Cart     │ │   Order    │   │  │
│  │  │  Service   │ │  Service   │ │  Service   │ │  Service   │   │  │
│  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘   │  │
│  └────────┼──────────────┼──────────────┼──────────────┼──────────┘  │
│           │              │              │              │              │
│  ┌────────▼──────────────▼──────────────▼──────────────▼──────────┐  │
│  │                   REPOSITORY LAYER                              │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │  │   User     │ │  Product   │ │   Cart     │ │   Order    │   │  │
│  │  │ Repository │ │ Repository │ │ Repository │ │ Repository │   │  │
│  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘   │  │
│  └────────┼──────────────┼──────────────┼──────────────┼──────────┘  │
│           │              │              │              │              │
│           └──────────────┴──────────────┴──────────────┘              │
│                                    │                                   │
│                          ┌─────────▼─────────┐                        │
│                          │      MODELS        │                        │
│                          │  (Mongoose Schemas) │                        │
│                          └─────────────────────┘                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Data Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | MongoDB | NoSQL document store |
| ODM | Mongoose | MongoDB object modeling |
| Payment Gateway | Razorpay | Payment processing |

---

## 3. Module Architecture

### 3.1 User Module
```
┌─────────────────────────────────────────────┐
│              USER MODULE                    │
├─────────────────────────────────────────────┤
│                                             │
│  Routes: /api/v1/users                      │
│  ├── POST   /register  → Register new user  │
│  ├── POST   /login    → User login          │
│  └── GET    /profile  → Get user profile   │
│                                             │
│  Controller: user.controller.js            │
│  ├── register()                             │
│  ├── login()                                │
│  └── getProfile()                           │
│                                             │
│  Service: user.service.js                   │
│  ├── createUser()                           │
│  ├── validateUser()                         │
│  └── generateToken()                        │
│                                             │
│  Repository: user.repository.js            │
│  ├── create()                               │
│  ├── findByEmail()                          │
│  └── findById()                             │
│                                             │
│  Model: user.model.js                       │
│  └── UserSchema                             │
└─────────────────────────────────────────────┘
```

### 3.2 Product Module
```
┌─────────────────────────────────────────────┐
│             PRODUCT MODULE                  │
├─────────────────────────────────────────────┤
│                                             │
│  Routes: /api/v1/products                  │
│  ├── POST   /         → Create product     │
│  ├── GET    /         → Get all products   │
│  ├── GET    /:id      → Get product by ID  │
│  ├── PUT    /:id      → Update product     │
│  └── DELETE /:id      → Delete product     │
│                                             │
│  Controller: product.controller.js         │
│  ├── createProduct()                        │
│  ├── getAllProducts()                       │
│  ├── getProductById()                       │
│  ├── updateProduct()                        │
│  └── deleteProduct()                        │
│                                             │
│  Service: product.service.js               │
│  ├── create()                               │
│  ├── getAll()                               │
│  ├── getById()                              │
│  ├── update()                               │
│  └── delete()                               │
│                                             │
│  Repository: product.repository.js         │
│  ├── create()                               │
│  ├── findAll()                              │
│  ├── findById()                             │
│  ├── findByIdAndUpdate()                    │
│  └── findByIdAndDelete()                    │
│                                             │
│  Model: product.model.js                    │
│  └── ProductSchema                          │
└─────────────────────────────────────────────┘
```

### 3.3 Cart Module
```
┌─────────────────────────────────────────────┐
│              CART MODULE                    │
├─────────────────────────────────────────────┤
│                                             │
│  Routes: /api/v1/cart                       │
│  ├── POST   /         → Add to cart         │
│  ├── GET    /         → Get cart            │
│  └── DELETE /:productId → Remove from cart  │
│                                             │
│  Controller: cart.controller.js            │
│  ├── addToCart()                            │
│  ├── getCart()                              │
│  └── removeFromCart()                       │
│                                             │
│  Service: cart.service.js                   │
│  ├── addItem()                              │
│  ├── getUserCart()                          │
│  ├── removeItem()                           │
│  └── clearCart()                            │
│                                             │
│  Repository: cart.repository.js             │
│  ├── create()                               │
│  ├── findByUserId()                         │
│  ├── findByIdAndUpdate()                    │
│  └── findByIdAndDelete()                    │
│                                             │
│  Model: cart.model.js                       │
│  └── CartSchema (with CartItem subdocument) │
└─────────────────────────────────────────────┘
```

### 3.4 Order Module
```
┌─────────────────────────────────────────────┐
│             ORDER MODULE                    │
├─────────────────────────────────────────────┤
│                                             │
│  Routes: /api/v1/orders                    │
│  ├── POST   /           → Create order      │
│  ├── GET    /           → Get all (Admin)   │
│  ├── GET    /my-orders  → Get my orders     │
│  └── POST   /verify    → Verify payment     │
│                                             │
│  Controller: order.controller.js           │
│  ├── createOrder()                          │
│  ├── getMyOrders()                          │
│  ├── getAllOrders()                         │
│  └── verifyPayment()                        │
│                                             │
│  Service: order.service.js                 │
│  ├── createOrder()                          │
│  ├── getOrdersByUser()                      │
│  ├── getAllOrders()                         │
│  ├── verifyRazorpayPayment()               │
│  └── updateOrderStatus()                    │
│                                             │
│  Repository: order.repository.js           │
│  ├── create()                               │
│  ├── findByUserId()                         │
│  ├── findAll()                              │
│  └── findById()                             │
│                                             │
│  Model: order.model.js                      │
│  └── OrderSchema (with OrderItem subdoc)   │
│                                             │
│  Integration: razorpay.js (config)          │
│  └── razorpay instance                      │
└─────────────────────────────────────────────┘
```

---

## 4. Request/Response Flow

### 4.1 User Registration Flow
```
Client                    Server                      Database
  │                          │                           │
  │──POST /register─────────>│                           │
  │   {name, email, password}                           │
  │                          │                           │
  │                          │──User.create()───────────>│
  │                          │   (hash password)         │
  │                          │<──User saved──────────────│
  │                          │                           │
  │<──201 Created────────────│                           │
  │   {user, token}          │                           │
```

### 4.2 Order Creation Flow (With Payment)
```
Client                    Server              Razorpay         Database
  │                          │                     │               │
  │──POST /orders───────────>│                     │               │
  │   {items from cart}       │                     │               │
  │                          │                     │               │
  │                          │──Razorpay───────────>│               │
  │                          │   Order.create()     │               │
  │                          │<──order_id───────────│               │
  │                          │                     │               │
  │<──Order created──────────│                     │               │
  │   {razorpayOrderId}      │                     │               │
  │                          │                     │               │
  │ (Payment via Razorpay)   │                     │               │
  │                          │                     │               │
  │──POST /orders/verify─────>│                     │               │
  │   {payment details}      │                     │               │
  │                          │                     │               │
  │                          │──Verify signature───>│               │
  │                          │<──verified───────────│               │
  │                          │                     │               │
  │                          │──Order.update()─────────────────────>│
  │                          │   (paymentStatus: PAID)             │
  │                          │                     │               │
  │<──Payment verified───────│                     │               │
```

---

## 5. Security Architecture

### 5.1 Authentication Flow
```
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User Login                                                      │
│     Client ──POST /login──> Server                                 │
│                          │                                          │
│                          ├──Verify credentials                     │
│                          ├──Generate JWT token                     │
│                          │   (JWT_SECRET from env)                  │
│                          │                                          │
│     Client <──Token───── Server                                    │
│                                                                     │
│  2. Subsequent Requests                                            │
│     Client ──GET /products──> Server                               │
│              Header: Authorization: Bearer <token>                │
│                          │                                          │
│                          ├──Verify JWT                             │
│                          ├──Extract user info                      │
│                          │                                          │
│     Client <──Response──── Server                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Role-Based Access Control (RBAC)
```
┌─────────────────────────────────────────────────────────────────────┐
│                         RBAC MATRIX                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Route                  │ USER  │ ADMIN │ Auth Required            │
│  ──────────────────────┼───────┼───────┼─────────────────────────  │
│  POST /users/register  │   ✓   │   ✓   │ No                       │
│  POST /users/login     │   ✓   │   ✓   │ No                       │
│  GET /users/profile    │   ✓   │   ✓   │ Yes (USER/ADMIN)        │
│  ──────────────────────┼───────┼───────┼─────────────────────────  │
│  GET /products         │   ✓   │   ✓   │ No                       │
│  GET /products/:id     │   ✓   │   ✓   │ No                       │
│  POST /products        │   ✗   │   ✓   │ Yes (ADMIN only)         │
│  PUT /products/:id     │   ✗   │   ✓   │ Yes (ADMIN only)         │
│  DELETE /products/:id  │   ✗   │   ✓   │ Yes (ADMIN only)         │
│  ──────────────────────┼───────┼───────┼─────────────────────────  │
│  GET /cart             │   ✓   │   ✓   │ Yes                      │
│  POST /cart            │   ✓   │   ✓   │ Yes                      │
│  DELETE /cart/:productId│  ✓   │   ✓   │ Yes                      │
│  ──────────────────────┼───────┼───────┼─────────────────────────  │
│  POST /orders          │   ✓   │   ✓   │ Yes                      │
│  GET /orders/my-orders │   ✓   │   ✓   │ Yes                      │
│  GET /orders           │   ✗   │   ✓   │ Yes (ADMIN only)         │
│  POST /orders/verify   │   ✓   │   ✓   │ Yes                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack Details

### 6.1 Backend Technologies
| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | Latest LTS |
| Framework | Express.js | ^4.x |
| Database | MongoDB | Latest |
| ODM | Mongoose | ^6.x |
| Auth | jsonwebtoken | ^9.x |
| Payment | razorpay | ^2.x |
| Environment | dotenv | ^16.x |
| CORS | cors | ^2.x |

### 6.2 Project Directory Structure
```
backend/
├── package.json              # Dependencies
├── src/
│   ├── app.js               # Express app setup
│   ├── server.js            # Entry point
│   ├── config/
│   │   └── razorpay.js     # Razorpay configuration
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT authentication
│   │   └── error.middleware.js   # Error handling
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.model.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.routes.js
│   │   │   └── user.service.js
│   │   ├── product/
│   │   │   ├── product.controller.js
│   │   │   ├── product.model.js
│   │   │   ├── product.repository.js
│   │   │   ├── product.routes.js
│   │   │   └── product.service.js
│   │   ├── cart/
│   │   │   ├── cart.controller.js
│   │   │   ├── cart.model.js
│   │   │   ├── cart.repository.js
│   │   │   ├── cart.routes.js
│   │   │   └── cart.service.js
│   │   └── order/
│   │       ├── order.controller.js
│   │       ├── order.model.js
│   │       ├── order.repository.js
│   │       ├── order.routes.js
│   │       └── order.service.js
│   └── utils/
└── .env                     # Environment variables
```

---

## 7. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

   ┌──────────┐      ┌────────────┐      ┌────────────┐      ┌───────────┐
   │  Request │─────▶│  Router    │─────▶│ Controller│─────▶│  Service  │
   └──────────┘      └────────────┘      └────────────┘      └─────┬─────┘
                                                                        │
   ┌──────────┐      ┌────────────┐      ┌────────────┐                │
   │ Response │◀─────│  Router    │◀─────│ Controller │◀─────│  Service  │
   └──────────┘      └────────────┘      └────────────┘      └─────┬─────┘
                                                                        │
                                                                    ┌───▼────┐
                                                                    │Repository│
                                                                    └───┬────┘
                                                                        │
                                                                    ┌───▼────┐
                                                                    │ Model  │
                                                                    └───┬────┘
                                                                        │
                                                                    ┌───▼────┐
                                                                    │MongoDB │
                                                                    └────────┘
```

---

## 8. Error Handling Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐                                                   │
│  │   Route     │                                                   │
│  │  (catch)    │                                                   │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────┐                                                   │
│  │ Controller  │──────▶ throw error / next(error)                 │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────┐                                                   │
│  │   Service  │──────▶ throw error / next(error)                  │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────┐                                                   │
│  │ Repository  │──────▶ throw error / next(error)                 │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Error Middleware                                │   │
│  │  (error.middleware.js)                                       │   │
│  │                                                              │   │
│  │  1. Log error                                                │   │
│  │  2. Send appropriate HTTP response                           │   │
│  │     - 400: Bad Request                                       │   │
│  │     - 401: Unauthorized                                      │   │
│  │     - 403: Forbidden                                         │   │
│  │     - 404: Not Found                                         │   │
│  │     - 500: Internal Server Error                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       DEPLOYMENT VIEW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     PRODUCTION ENVIRONMENT                    │   │
│  │                                                              │   │
│  │   ┌──────────────┐                                          │   │
│  │   │   Load       │                                          │   │
│  │   │   Balancer   │                                          │   │
│  │   └──────┬───────┘                                          │   │
│  │          │                                                  │   │
│  │          ▼                                                  │   │
│  │   ┌──────────────┐    ┌──────────────┐                      │   │
│  │   │   Node.js   │    │   Node.js   │   (Multiple Instances)│   │
│  │   │   Server    │    │   Server    │                      │   │
│  │   └──────┬───────┘    └──────┬───────┘                      │   │
│  │          │                   │                               │   │
│  └──────────┼───────────────────┼───────────────────────────────┘   │
│             │                   │                                   │
│             │    ┌──────────────┼──────────────┐                     │
│             │    │              │              │                     │
│             ▼    ▼              ▼              ▼                     │
│        ┌─────────┐      ┌──────────┐    ┌──────────┐                 │
│        │ MongoDB │      │ Razorpay │    │   Email  │                 │
│        │ Cluster │      │   API    │    │   Service│                 │
│        └─────────┘      └──────────┘    └──────────┘                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

