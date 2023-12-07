import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SearchPage.css";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "../global/NavigationBar";
import { getPublicUrl } from "../../lib/utils";
import Footer from "../mobile/global/footer/Footer";
import ListingCard from "../global/ListingCard";

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
        query_lower.length >= 2 &&
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

  return (
    <div className="search-page-container">
      <NavigationBar />
      <div className="search-page">
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="mobile-search-bar"
        ></input>
        <div className="search-results">
          {searchedListings.length > 0 ? (
            searchedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing}></ListingCard>
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
