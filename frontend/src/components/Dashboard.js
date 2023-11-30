import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { supabase_client } from "../lib/supabase-client";
import { fetchServer } from "../lib/fetchServer";
import ListingWizard from "./ListingWizard";
import { useAuctionStore } from "../lib/ListingStore";
import FeaturedItem from "./home/FeaturedItem";

function Dashboard() {
  const { auctionListings } = useAuctionStore();

  const navigate = useNavigate();

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
        <button onClick={() => navigate("/my-listings")}>
          <i className="fa-solid fa-gavel"></i>
          Listings
        </button>
        <button onClick={() => navigate("/home")}>
          <i className="fa-solid fa-money-bills"></i>
          Bids
        </button>
        <button onClick={() => navigate("/home")}>
          <i className="fa-solid fa-newspaper"></i>
          Subscribed
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="search-bar">
          <input placeholder="Search..."></input>
          <i className="fa-solid fa-magnifying-glass button"></i>
        </div>
        <div>
          <h2>Featured</h2>
          <FeaturedItem listing={auctionListings[0]} />
          {/* <p>No actively featured items</p> */}
        </div>

        <h2>All Listings</h2>
        <div className="my-listings">
          {auctionListings.length > 0 ? (
            auctionListings.map((listing) => (
              <div key={listing.id} className="listing">
                <h3>{listing.title}</h3>
                {listing.images && listing.images.length > 0 && (
                  <a href={`/listing/${listing.id}`}>
                    <img src={listing.images[0]} alt="An img" />
                  </a>
                )}
                <p>{listing.description}</p>
                <div className="details">
                  <span className="start-price">
                    Starting: ${listing.start_price}
                  </span>
                  <span className="increment">
                    Increment: +${listing.increment}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>You have no listings</p>
          )}
        </div>
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
