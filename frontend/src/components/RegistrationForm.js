import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; 

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', formData);
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <div className="form-container"> 
      <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <br /> 
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
