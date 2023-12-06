import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ListingSearch.css";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import { getPublicUrl } from "../../lib/utils";

function ListingSearch() {
  const { auctionListings } = useSparkBidContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null); // Ref for the modal
  const inputRef = useRef(null); // Ref for the input field

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = auctionListings
      .filter(
        (listing) =>
          lowerCaseQuery.length > 0 &&
          (listing.title.toLowerCase().includes(lowerCaseQuery) ||
            listing.description?.toLowerCase().includes(lowerCaseQuery))
      )
      .slice(0, 5);

    setFilteredResults(results);
  }, [searchQuery, auctionListings]);

  useEffect(() => {
    // Function to handle click outside the modal
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("click", handleClickOutside);

    // Clean up
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    setIsModalOpen(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`/search/${searchQuery}`);
      setIsModalOpen(false);
    }
  };

  const handleResultClick = (listingId) => {
    navigate(`/listing/${listingId}`);
    setIsModalOpen(false);
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="listing-search-container">
      <input
        ref={inputRef}
        placeholder="Search listings..."
        value={searchQuery}
        onKeyPress={handleKeyPress}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isModalOpen && filteredResults.length > 0 && (
        <div ref={modalRef} className="search-results-modal">
          {filteredResults.map((listing) => (
            <a
              href={`/listing/${listing.id}`}
              key={listing.id}
              className="search-listing"
              onClick={() => handleResultClick(listing.id)}
            >
              {listing.image_ids && listing.image_ids.length > 0 && (
                <img
                  src={getPublicUrl(listing.user_id, listing.image_ids[0])}
                  alt="An img"
                />
              )}
              <div className="search-details">
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListingSearch;
