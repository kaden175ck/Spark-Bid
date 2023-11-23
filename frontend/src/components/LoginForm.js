import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase_client } from "../lib/supabase-client";
import "./LoginForm.css"; // Ensure this path is correct

function LoginForm() {
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase_client.auth.signInWithOAuth({
      provider,
    });
    if (error) console.log(error);
  };

  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   if (!formData.email || !formData.password) {
  //     setError("Please enter both email and password");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3001/login",
  //       formData
  //     );
  //     console.log("Login successful:", response.data);
  //     navigate("/dashboard"); // Navigate to the dashboard
  //   } catch (error) {
  //     setError("Login failed: " + error.response.data);
  //     console.error("Login error:", error.response.data);
  //   }
  // };

  // const handleRegister = () => {
  //   navigate("/signup"); // Navigate to the signup page
  // };

  return (
    <div className="form-container">
      <div className="login-form">
        <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
        {/* <form onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="login-btn">
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="register-btn"
            >
              Register
            </button>
          </div>
        </form> */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("discord")}
          className="register-btn"
        >
          <i className="fa-brands fa-discord"></i> Discord
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className="register-btn"
        >
          <i className="fa-brands fa-google"></i> Google
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
