import { useState } from "react";
import { loginUser } from "../api/authApi";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      login(res.data.user, res.data.token);

      // Redirect based on user role
      if (res.data.user.role === "ADMIN") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Sign In
          </button>
        </form>

        <div className="form-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
