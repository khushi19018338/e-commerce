import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import OrderCard from "../components/OrderCard";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    async function fetchOrders() {
      try {
        const res = await getMyOrders();
        // Backend returns orders directly in res.data (not res.data.data)
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    }

    fetchOrders();

  }, []);

  return (
    <div className="container">

      <h2>My Orders</h2>

      {(orders || []).length === 0 && (
        <p>No orders found</p>
      )}

      {(orders || []).map((order) => (

        <OrderCard
          key={order._id}
          order={order}
        />

      ))}

    </div>
  );
}

export default Orders;
