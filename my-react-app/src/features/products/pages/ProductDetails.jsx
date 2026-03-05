import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { addToCart } from "../../cart/api/cartApi";
import useCart from "../../cart/hooks/useCart";
import Loader from "../../../shared/components/Loader";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {

    async function fetchProduct() {

      try {
        const res = await getProductById(id);
        setProduct(res.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      // Refresh cart to show the new item
      await fetchCart();
      alert("Added to cart!");
      navigate("/cart");
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="page-container"><Loader /></div>;

  if (!product) return <div className="page-container"><p>Product not found</p></div>;

  return (
    <div className="page-container">
      <div className="product-details">
        <div className="product-details-image">
          {product.image ? (
            <img 
              src={`http://localhost:5000${product.image}`} 
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
          ) : (
            <div className="product-image-placeholder" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0", borderRadius: "8px" }}>
              <span style={{ fontSize: "80px" }}>🛍️</span>
            </div>
          )}
        </div>
        <div className="product-details-info">
          <h2 className="product-details-title">{product.name}</h2>
          <p className="product-details-category">{product.category}</p>
          <p className="product-details-description">{product.description}</p>
          <h3 className="product-details-price">${product.price}</h3>
          <p className="product-details-stock">Stock: {product.stock} items available</p>
          
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
