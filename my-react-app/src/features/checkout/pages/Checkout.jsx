import useCart from "../../cart/hooks/useCart";
import CheckoutForm from "../components/CheckoutForm";

function Checkout() {

  const { cart } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="container">

      <h2>Checkout</h2>

      {cart.items.map((item) => (

        <div key={item.product._id}>

          {item.product.name} × {item.quantity}

        </div>

      ))}

      <h3>Total: ${total}</h3>

      <CheckoutForm />

    </div>
  );
}

export default Checkout;