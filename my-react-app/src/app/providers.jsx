import { AuthProvider } from "../features/auth/context/AuthContext";
import { CartProvider } from "../features/cart/context/CartContext";

function Providers({ children }) {

  return (
    <AuthProvider>

      <CartProvider>
        {children}
      </CartProvider>

    </AuthProvider>
  );
}

export default Providers;