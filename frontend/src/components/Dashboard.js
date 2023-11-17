import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // State to store auction items

  useEffect(() => {
    // Fetch auction items when the component mounts
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items'); // Adjust the endpoint as needed
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = () => {
    // Perform actions needed to log out the user, like clearing auth tokens
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to your Dashboard!</h1>
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
      </header>
      <nav className="dashboard-nav">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/my-auctions')}>My Auctions</button>
        <button onClick={() => navigate('/profile')}>Profile</button>
      </nav>
      <main className="dashboard-content">
        <h2>Active Auction Items</h2>
        <section className="dashboard-items">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="item">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {/* Need more item details like bid amount, time left, etc. */}
              </div>
            ))
          ) : (
            <p>No active auction items to display.</p>
          )}
        </section>
      </main>
      <footer className="dashboard-footer">
        <p>Contact Us | Terms of Service | Privacy Policy</p>
      </footer>
    </div>
  );
}

export default Dashboard;
