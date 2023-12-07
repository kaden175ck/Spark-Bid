import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { supabase_client } from "../lib/supabase-client";
import { fetchServer } from "../lib/fetchServer";
import ListingWizard from "./ListingWizard";
import { useSparkBidContext } from "../lib/SparkBidStore";
import FeaturedItem from "./home/FeaturedItem";
import ListingSearch from "./search/ListingSearch";
import { getPublicUrl } from "../lib/utils";
import Footer from "./mobile/global/footer/Footer";
import NavigationBar from "./global/NavigationBar";
import ListingCard from "./global/ListingCard";

function Dashboard() {
  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

  const [popularListings, setPopularListings] = useState([]);
  useEffect(() => {
    const bidCountByListingId = auctionBids.reduce((map, bid) => {
      if (!map[bid.listing_id]) map[bid.listing_id] = 1;
      map[bid.listing_id]++;
      return map;
    }, {});

    const popularListings = auctionListings
      .filter((l) => !l.is_sold)
      .toSorted((l1, l2) => {
        const bidCount1 = bidCountByListingId[l1.id] || 0; // Assumes 0 if ID not found
        const bidCount2 = bidCountByListingId[l2.id] || 0; // Assumes 0 if ID not found

        return bidCount2 - bidCount1; // Sorts in descending order
      })
      .slice(0, 4);

    setPopularListings(popularListings);
  }, [auctionListings, auctionBids]);

  const [highestBidMap, setHighestBidMap] = useState({});
  useEffect(() => {
    // Filter auctionListings based on user_id

    const highest_bid_map = auctionBids.reduce((map, bid) => {
      if (!map[bid.listing_id] || bid.amount > map[bid.listing_id].amount)
        map[bid.listing_id] = bid;
      return map;
    }, {});

    setHighestBidMap(highest_bid_map);
  }, [auctionBids]);

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
        <button onClick={() => navigate("/my-bids")}>
          <i className="fa-solid fa-money-bills"></i>
          Bids
        </button>
        <button onClick={() => navigate("/subscribed-page")}>
          <i className="fa-solid fa-newspaper"></i>
          Subscribed
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <ListingSearch></ListingSearch>
          </div>
          <a href="/search">
            <i className="fa-solid fa-magnifying-glass button"></i>
          </a>
        </div>
        <div>
          <h2>Featured</h2>
          {popularListings.length > 0 ? (
            <FeaturedItem
              listing={popularListings[0]}
              bids={auctionBids}
              users={sparkUsers}
            />
          ) : (
            <p> No active listings...</p>
          )}
        </div>

        <h2>Popular Listings</h2>
        <div className="my-listings">
          {popularListings.length > 0 ? (
            popularListings.map((listing) => <ListingCard listing={listing} />)
          ) : (
            <p>You have no listings</p>
          )}

          <h2>Subscribed Listings</h2>
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
      <Footer />
    </div>
  );
}

export default Dashboard;
