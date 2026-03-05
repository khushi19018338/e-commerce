import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

function RegisterUser() {

  const navigate = useNavigate();

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

      await registerUser(form);

      alert("User registered successfully");

      navigate("/login");

    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Register as a regular user</p>

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

          <button type="submit" className="btn btn-primary btn-full">
            Register
          </button>
        </form>

        <div className="form-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
