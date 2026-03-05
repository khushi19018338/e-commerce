import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

export default function useProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getProducts(params);
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts
  };
}
