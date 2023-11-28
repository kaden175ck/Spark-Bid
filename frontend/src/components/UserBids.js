import "./UserBids.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { supabase_client } from "../lib/supabase-client";
import { useAuctionStore } from "../lib/ListingStore";
import BidFeature from "./home/BidFeature";
import BidModule from "./home/BidModule";

function UserBids() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { auctionListings } = useAuctionStore();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase_client.auth.signOut();
    console.log(error);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div class="page_container">
      <nav class="navbar">
        <div class="nav_left">
          <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
          <button onClick={() => navigate("/dashboard")}>
            <i className="fa-solid fa-house"></i>
            Home
          </button>
          <button onClick={() => navigate("/my-auctions")}>
            <i className="fa-solid fa-gavel"></i>
            Listings
          </button>
          <button onClick={() => navigate("/user-bids")}>
            <i className="fa-solid fa-money-bills"></i>
            Bids
          </button>
          <button onClick={() => navigate("/dashboard")}>
            <i className="fa-solid fa-newspaper"></i>
            Subscribed
          </button>
        </div>

        <div className="search-bar">
          <input placeholder="Search..."></input>
          <i className="fa-solid fa-magnifying-glass button"></i>
        </div>

        <div class="nav_right">
          <button onClick={() => navigate("/profile")}>
            <i className="fa-solid fa-user button"></i>
          </button>
          <button onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket button"></i>
          </button>
        </div>
      </nav>
      <main>
        <BidFeature />

        <BidModule />

        <section className="bid-history">
          <h1>PLACEHOLDER BID</h1>
          <h1>PLACEHOLDER BID</h1>
          <h1>PLACEHOLDER BID</h1>
          <h1>PLACEHOLDER BID</h1>
          <h1>PLACEHOLDER BID</h1>
          <h1>PLACEHOLDER BID</h1>
        </section>
      </main>
      <footer>
        {/*Leaving blank for now.*/}
      </footer>
    </div>
  )
}

export default UserBids;
