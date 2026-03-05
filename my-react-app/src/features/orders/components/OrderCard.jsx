function OrderCard({ order }) {

  return (
    <div className="order-card">

      <h3>Order ID: {order._id}</h3>

      <p>Status: {order.status}</p>

      <p>Payment: {order.paymentStatus}</p>

      <p>Total: ${order.totalAmount}</p>

      <h4>Items:</h4>

      {order.items.map((item) => (

        <div key={item.product._id}>

          {item.product.name} × {item.quantity}

        </div>

      ))}

    </div>
  );
}

export default OrderCard;