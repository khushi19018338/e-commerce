import { useState, useContext } from "react";
import { registerAdmin, loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function RegisterAdmin() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
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

      // First register the admin
      await registerAdmin(form);

      // Then auto-login to get the token
      const loginRes = await loginUser({ email: form.email, password: form.password });
      
      // Use context login function to update state
      login(loginRes.data.user, loginRes.data.token);

      alert("Admin registered and logged in successfully!");
      
      // Redirect to admin products page
      navigate("/admin/products");

    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Admin registration failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Admin Registration</h2>
        <p className="form-subtitle">Create an admin account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              name="name"
              className="form-input"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="Create a password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-secondary btn-full">
            Register as Admin
          </button>
        </form>

        <div className="form-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
          <p style={{ marginTop: '10px' }}><Link to="/register">Register as User</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdmin;
