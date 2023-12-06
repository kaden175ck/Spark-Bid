import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SearchPage.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import FeaturedItem from "../home/FeaturedItem";
import NavigationBar from "../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import Footer from "../mobile/global/footer/Footer";

function SearchPage() {
  let { query: urlQuery } = useParams();

  const [searchQuery, setSearchQuery] = useState(urlQuery || ""); // State to keep track of search query
  const [searchedListings, setSearchedListings] = useState([]);
  const [highestBidMap, setHighestBidMap] = useState({});

  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

  useEffect(() => {
    // Update state when URL query changes
    setSearchQuery(urlQuery || "");
  }, [urlQuery]);

  useEffect(() => {
    // Filter auctionListings based on user_id
    const query_lower = searchQuery.toLowerCase();
    const searched_listings = auctionListings.filter(
      (listing) =>
        query_lower.length >= 3 &&
        (listing.title.toLowerCase().includes(query_lower) ||
          listing.description?.toLowerCase().includes(query_lower))
    );

    const highest_bid_map = auctionBids.reduce((map, bid) => {
      if (!map[bid.listing_id] || map[bid.listing_id].amount < bid.amount)
        map[bid.listing_id] = bid;
      return map;
    }, {});

    setSearchedListings(searched_listings);
    setHighestBidMap(highest_bid_map);
  }, [auctionListings, auctionBids, searchQuery]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const navigate = useNavigate();

  const deleteListing = async (listing_id) => {
    let { error } = await supabase_client
      .from("auction_listing")
      .delete()
      .eq("id", listing_id);
    if (error) console.error(error);
  };

  return (
    <div className="search-page-container">
      <NavigationBar />
      <div className="search-page">
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
        ></input>
        <div className="search-results">
          {searchedListings.length > 0 ? (
            searchedListings.map((listing) => (
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
            <p>No Results...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
