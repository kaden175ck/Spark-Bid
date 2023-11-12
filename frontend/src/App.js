import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> 
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate replace to="/login" />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
