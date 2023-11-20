import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { supabase_client } from "../lib/supabase-client";
import { fetchServer } from "../lib/fetchServer";

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // State to store auction items

  useEffect(() => {
    // Fetch auction items when the component mounts
    const fetchItems = async () => {
      try {
        const response = await fetchServer("http://localhost:3001/api/items", {
          credentials: "include",
        }); // Adjust the endpoint as needed
        console.log(response);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase_client.auth.signOut();
    console.log(error);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
        <button onClick={() => navigate("/home")}>
          <i className="fa-solid fa-house"></i>
          Home
        </button>
        <button onClick={() => navigate("/my-auctions")}>
          <i className="fa-solid fa-gavel"></i>
          Listings
        </button>
        <button onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-money-bills"></i>
          Bids
        </button>
        <button onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-newspaper"></i>
          Subscribed
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="search-bar">
          <input placeholder="Search..."></input>
          <i className="fa-solid fa-magnifying-glass button"></i>
        </div>
        <h2>Featured</h2>
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
      <nav className="dashboard-nav nav-right">
        <i
          className="fa-solid fa-user button"
          onClick={() => navigate("/profile")}
        ></i>
        <i
          className="fa-solid fa-right-from-bracket button"
          onClick={handleLogout}
        ></i>
      </nav>
    </div>
  );
}

export default Dashboard;
