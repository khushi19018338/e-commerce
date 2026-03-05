import { useEffect, useState } from "react";
import { getAllOrders } from "../api/orderApi";
import useAuth from "../../auth/hooks/useAuth";
import OrderCard from "../components/OrderCard";
import Loader from "../../../shared/components/Loader";

function AdminOrders() {

  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);

  // Show loading while auth is being checked
  if (authLoading) {
    return <Loader />;
  }

  if (!user || user.role !== "ADMIN") {
    return <p>Access Denied</p>;
  }

  useEffect(() => {

    async function fetchOrders() {
      try {
        const res = await getAllOrders();
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

      <h2>All Orders</h2>

      {(orders || []).map((order) => (

        <OrderCard
          key={order._id}
          order={order}
        />

      ))}

    </div>
  );
}

export default AdminOrders;
