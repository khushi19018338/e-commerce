import { Link } from "react-router-dom";
import { addToCart } from "../../cart/api/cartApi";
import useCart from "../../cart/hooks/useCart";

function ProductCard({ product }) {

  const { fetchCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {

      await addToCart({
        productId: product._id,
        quantity: 1
      });

      // Refresh cart to show the new item
      await fetchCart();

      alert("Added to cart!");

    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login to add items to cart");
      } else {
        alert("Failed to add to cart");
      }
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      {product.image ? (
        <div className="product-image">
          <img 
            src={`http://localhost:5000${product.image}`} 
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div className="product-image-placeholder">
          <span>🛍️</span>
        </div>
      )}
      
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price">${product.price}</div>
        
        <button 
          className="btn btn-primary btn-full" 
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
