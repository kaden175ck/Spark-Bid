import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submits

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Disable the form
    try {
      const response = await axios.post('http://localhost:3001/register', formData);
      console.log('User registered:', response.data);
      setMessage(`An email has been sent to ${formData.email} with further instructions.`);
      setFormData({ username: '', email: '', password: '' }); // Clear the form
    } catch (error) {
      console.error('Registration error:', error.response.data);
      setMessage('Registration failed. Please try again.');
    }
    setIsSubmitting(false); // Re-enable the form
  };

  return (
    <div className="form-container registration-form">
      <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} disabled={isSubmitting} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} />
        </div>
        <div className="form-actions">
          <button type="submit" className="register-btn" disabled={isSubmitting}>Register</button>
        </div>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default RegistrationForm;
