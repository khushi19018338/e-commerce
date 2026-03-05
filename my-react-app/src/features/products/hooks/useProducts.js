import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

export default function useProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (params = {}) => {

    try {

      const res = await getProducts(params);

      // Backend returns { total, page, pages, products }
      setProducts(res.data.products || []);

    } catch (err) {

      console.log(err);
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
    fetchProducts
  };
}
