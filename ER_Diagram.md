# Entity-Relationship (ER) Diagram

## E-Commerce Backend API

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    E-COMMERCE SYSTEM                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │     USER     │
                                    ├──────────────┤
                                    │ +id (PK)     │
                                    │ name         │
                                    │ email (UQ)   │
                                    │ password     │
                                    │ role         │
                                    │ createdAt    │
                                    │ updatedAt    │
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    │ 1                    │ 1                    │
                    ▼                      ▼                      ▼
         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │      PRODUCT      │  │       CART        │  │       ORDER      │
         ├───────────────────┤  ├───────────────────┤  ├───────────────────┤
         │ +id (PK)          │  │ +id (PK)          │  │ +id (PK)          │
         │ name              │◄─┤ user_id (FK)     │◄─┤ user_id (FK)     │
         │ description       │  │ createdAt         │  │ totalAmount      │
         │ price             │  │ updatedAt         │  │ status           │
         │ stock             │  └───────────────────┘  │ razorpayOrderId  │
         │ category          │                         │ razorpayPaymentId│
         │ createdBy (FK)────┘                         │ razorpaySignature│
         │ createdAt                                    │ paymentStatus    │
         │ updatedAt                                    │ createdAt        │
         └──────────────────────────────────────────────│ updatedAt        │
                                                         └────────┬─────────┘
                                                                  │
                                                                  │ 1:N
                                                                  │
                                                         ┌────────▼────────┐
                                                         │   ORDER_ITEM    │
                                                         ├─────────────────┤
                                                         │ +id (PK)        │
                                                         │ order_id (FK)   │
                                                         │ product_id (FK) │
                                                         │ quantity        │
                                                         │ price           │
                                                         └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RELATIONSHIPS                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

1. USER → PRODUCT (One-to-Many)
   - One User (ADMIN) can create Many Products
   - createdBy field in Product references User

2. USER → CART (One-to-One)
   - One User has One Cart
   - user_id in Cart references User (unique constraint)

3. USER → ORDER (One-to-Many)
   - One User can place Many Orders
   - user_id in Order references User

4. ORDER → ORDER_ITEM (One-to-Many)
   - One Order contains Many Order Items
   - order_id in Order Item references Order

5. PRODUCT → ORDER_ITEM (One-to-Many)
   - One Product can appear in Many Order Items
   - product_id in Order Item references Product

6. CART → CART_ITEM (One-to-Many - Embedded)
   - One Cart contains Many Cart Items (as embedded array)
   - Cart Item references Product

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                       CARDINALITY                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     1      ┌──────────┐
│  USER    │───────────│ PRODUCT  │
└──────────┘            └──────────┘
   1│                      │N
    │                      │
    │                      │
    │ 1                    │ 1
    ▼                      ▼
┌──────────┐            ┌──────────┐
│  USER    │───────────│   CART   │
└──────────┘            └──────────┘
   1│                      │1
    │                      │
    │                      │
    │ N                    │ 1
    ▼                      ▼
┌──────────┐            ┌──────────┐
│  ORDER   │───────────│ORDER_ITEM│
└──────────┘            └──────────┘
   1│                      │N
    │                      │
    │                      │
    │                      │ N
    ▼                      ▼
┌──────────┐            ┌──────────┐
│ PRODUCT  │───────────│ORDER_ITEM│
└──────────┘            └──────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ENTITY DETAILS                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ USER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Field         │ Type          │ Constraints                                            │
├────────────────┼───────────────┼────────────────────────────────────────────────────────┤
│ _id            │ ObjectId      │ Primary Key, Auto-generated                           │
│ name           │ String        │ Required, Trimmed                                     │
│ email          │ String        │ Required, Unique, Lowercase                          │
│ password       │ String        │ Required (hashed)                                     │
│ role           │ String        │ Enum: USER | ADMIN, Default: USER                    │
│ createdAt      │ Date          │ Auto-generated                                        │
│ updatedAt      │ Date          │ Auto-generated                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODUCT                                                                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Field         │ Type          │ Constraints                                            │
├────────────────┼───────────────┼────────────────────────────────────────────────────────┤
│ _id            │ ObjectId      │ Primary Key, Auto-generated                           │
│ name           │ String        │ Required, Trimmed                                    │
│ description    │ String        │ Required                                              │
│ price          │ Number        │ Required                                              │
│ stock          │ Number        │ Required                                              │
│ category       │ String        │ Required                                              │
│ createdBy      │ ObjectId      │ Required, Ref: User (ADMIN only)                     │
│ createdAt      │ Date          │ Auto-generated                                        │
│ updatedAt      │ Date          │ Auto-generated                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CART                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Field         │ Type          │ Constraints                                            │
├────────────────┼───────────────┼────────────────────────────────────────────────────────┤
│ _id            │ ObjectId      │ Primary Key, Auto-generated                           │
│ user           │ ObjectId      │ Required, Unique, Ref: User                           │
│ items          │ Array         │ CartItem objects                                      │
│   └ product    │ ObjectId      │ Ref: Product                                          │
│   └ quantity   │ Number        │ Required, Min: 1                                      │
│ createdAt      │ Date          │ Auto-generated                                        │
│ updatedAt      │ Date          │ Auto-generated                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ORDER                                                                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Field                │ Type          │ Constraints                                      │
├──────────────────────┼───────────────┼──────────────────────────────────────────────────┤
│ _id                  │ ObjectId      │ Primary Key, Auto-generated                     │
│ user                 │ ObjectId      │ Required, Ref: User                              │
│ items                │ Array         │ OrderItem objects                                │
│   └ product          │ ObjectId      │ Ref: Product                                     │
│   └ quantity         │ Number        │ Required                                         │
│   └ price            │ Number        │ Required (price at time of order)                 │
│ totalAmount          │ Number        │ Required                                         │
│ status               │ String        │ Enum: PENDING | CONFIRMED | SHIPPED | DELIVERED│
│                      │               │           | CANCELLED, Default: PENDING         │
│ razorpayOrderId      │ String        │ Razorpay Order ID                                │
│ razorpayPaymentId    │ String        │ Razorpay Payment ID                              │
│ razorpaySignature    │ String        │ Razorpay Signature for verification              │
│ paymentStatus        │ String        │ Enum: UNPAID | PAID | FAILED, Default: UNPAID    │
│ createdAt            │ Date          │ Auto-generated                                   │
│ updatedAt            │ Date          │ Auto-generated                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    LEGEND                                               │
└────────────────────────────────────────────────────────────────────────────────────────┘

│ Symbol  │ Meaning                        │
├─────────┼────────────────────────────────┤
│ PK      │ Primary Key                    │
│ FK      │ Foreign Key                    │
│ UQ      │ Unique Constraint              │
│ Ref     │ Reference (Mongoose ref)       │
│ Enum    │ Enumeration (fixed set of vals) │
│ N       │ Many (one-to-many relationship) │
│ 1       │ One (one-to-one relationship)    │
└─────────┴────────────────────────────────┘

