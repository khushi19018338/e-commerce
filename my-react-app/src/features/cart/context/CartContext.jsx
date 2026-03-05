import { createContext, useEffect, useState } from "react";
import { getCart } from "../api/cartApi";
import useAuth from "../../auth/hooks/useAuth";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {

    try {

      const res = await getCart();

      setCart(res.data);

    } catch (err) {

      setCart(null);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    // Only fetch cart if auth is loaded and user is logged in
    if (!authLoading && user) {
      fetchCart();
    } else if (!authLoading && !user) {
      // User is not logged in
      setLoading(false);
      setCart(null);
    }

  }, [authLoading, user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
