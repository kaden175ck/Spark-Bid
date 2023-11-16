import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    // Perform actions needed to log out the user, like clearing auth tokens
    navigate('/login'); // Redirect to login after logout
  };

  // Example content for the dashboard
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to your Dashboard!</h1>
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
      </header>
      <nav className="dashboard-nav">
        {/* Navigation items can go here */}
      </nav>
      <main className="dashboard-content">
        {/* Dashboard main content can go here */}
        <p>This is the main area for dashboard content like user stats, recent activity, etc.</p>
      </main>
      <footer className="dashboard-footer">
        {/* Footer content can go here */}
      </footer>
    </div>
  );
}

export default Dashboard;
