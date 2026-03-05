import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Product Pages */
import Home from "../features/products/pages/Home";
import Products from "../features/products/pages/Products";
import ProductDetails from "../features/products/pages/ProductDetails";

/* Cart + Checkout */
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/checkout/pages/Checkout";

/* Orders */
import Orders from "../features/orders/pages/Orders";
import AdminOrders from "../features/orders/pages/AdminOrders";

/* Auth */
import Login from "../features/auth/pages/Login";
import RegisterUser from "../features/auth/pages/RegisterUser";
import RegisterAdmin from "../features/auth/pages/RegisterAdmin";

/* Admin */
import AdminProducts from "../features/products/admin/AdminProducts";

/* Shared */
import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import AdminRoute from "../shared/components/AdminRoute";

function Router() {
  return (
    <BrowserRouter>

      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>

          {/* PUBLIC ROUTES */}

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<RegisterUser />} />

          <Route path="/admin/register" element={<RegisterAdmin />} />



          {/* USER PROTECTED ROUTES */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />



          {/* ADMIN ROUTES */}

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

        </Routes>
      </main>

      <Footer />

    </BrowserRouter>
  );
}

export default Router;
