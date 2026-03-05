import { Link } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

function Navbar() {

  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link to="/" className="brand-logo">E-Shop</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {user && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Link to="/admin/products">Admin Products</Link>
            <Link to="/admin/orders">Admin Orders</Link>
          </>
        )}
      </div>

      <div className="navbar-auth">
        {!user && (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
            <Link to="/admin/register" className="btn-admin">Admin Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="user-name">Hello, {user.name || user.email}</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
