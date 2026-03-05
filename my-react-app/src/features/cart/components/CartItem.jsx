import { removeFromCart } from "../api/cartApi";
import useCart from "../hooks/useCart";

function CartItem({ item }) {

  const { fetchCart } = useCart();

  const handleRemove = async () => {

    await removeFromCart(item.product._id);

    fetchCart();

  };

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.product.name}</h3>
        <p className="cart-item-price">${item.product.price}</p>
        <p className="cart-item-quantity">Quantity: {item.quantity}</p>
      </div>
      <div className="cart-item-actions">
        <button className="btn btn-danger" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
