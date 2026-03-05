import useCart from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import Loader from "../../../shared/components/Loader";

function Cart() {

  const { cart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="page-container"><Loader /></div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="page-container">
      <h2 className="page-title">Your Shopping Cart</h2>

      <div className="cart-items">
        {cart.items.map((item) => (

          <CartItem
            key={item.product._id}
            item={item}
          />

        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: <span className="price">${total.toFixed(2)}</span></h3>
        </div>
        <button className="btn btn-primary btn-full" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}

export default Cart;
