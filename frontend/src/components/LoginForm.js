import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import './LoginForm.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // State for handling login errors
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/login', formData);
      console.log('Login successful:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      setError('Login failed: ' + error.response.data);
      console.error('Login error:', error.response.data);
    }
  };

  const handleRegister = () => {
    navigate('/signup'); // Navigate to the registration page
  };

  return (
    <div className="form-container">
      <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        {error && <div className="error-message">{error}</div>} 
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
}

export default LoginForm;
