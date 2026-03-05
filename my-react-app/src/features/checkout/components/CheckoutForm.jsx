import { createOrder, verifyPayment } from "../api/orderApi";
import { loadRazorpay } from "../services/razorpayService";
import useCart from "../../cart/hooks/useCart";

function CheckoutForm() {

  const { cart, fetchCart } = useCart();

  const handlePayment = async () => {

    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {

      // Backend fetches cart items directly, no need to send items
      const orderRes = await createOrder({});

      // Backend returns { message, order, razorpayOrder, key }
      const razorpayOrder = orderRes.data.razorpayOrder;
      const order = orderRes.data.order;

      console.log("Razorpay order:", razorpayOrder);

      const options = {

        key: orderRes.data.key || import.meta.env.VITE_RAZORPAY_KEY,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency || "INR",

        name: "My E-Commerce Store",

        description: "Order Payment",

        order_id: razorpayOrder.id,

        handler: async function (response) {

          try {
            // Match the field names with what backend expects
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Refresh cart after successful payment (cart is cleared on backend)
            await fetchCart();

            alert("Payment Successful!");
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            alert("Payment verification failed: " + verifyError.message);
          }

        },

        modal: {
          ondismiss: function() {
            // Refresh cart when modal is closed
            fetchCart();
          }
        }

      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Payment failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>

      <button onClick={handlePayment}>
        Pay Now
      </button>

    </div>
  );
}

export default CheckoutForm;
