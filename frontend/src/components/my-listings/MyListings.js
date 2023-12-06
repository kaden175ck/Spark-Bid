import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyListings.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "./../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import { getPublicUrl } from "../../lib/utils";

function MyListings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({});
  const openModal = (listing = {}) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedListing({});
    setIsModalOpen(false);
  };

  const { session, loading } = useAuth();

  const user_id = session?.user?.id;

  const { auctionListings } = useSparkBidContext();

  const [userAuctionListings, setUserAuctionListings] = useState([]);

  useEffect(() => {
    // Filter auctionListings based on user_id
    const filteredListings = auctionListings.filter(
      (listing) => listing.user_id === user_id
    );

    setUserAuctionListings(filteredListings);
  }, [auctionListings, user_id]);

  const navigate = useNavigate();
  // const [items, setItems] = useState([]); // State to store auction items

  // useEffect(() => {
  //   // Fetch auction items when the component mounts
  //   const fetchItems = async () => {
  //     try {
  //       const response = await fetchServer("http://localhost:3001/api/items", {
  //         credentials: "include",
  //       }); // Adjust the endpoint as needed
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       const data = await response.json();
  //       setItems(data);
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };

  //   fetchItems();
  // }, []);

  const deleteListing = async (listing_id) => {
    let { error } = await supabase_client
      .from("auction_listing")
      .delete()
      .eq("id", listing_id);
    if (error) console.error(error);
  };

  const handleLogout = async () => {
    const { error } = await supabase_client.auth.signOut();
    console.log(error);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="my-listings-container">
      <NavigationBar />
      <div className="my-listings-content">
        <div className="my-listings-header">
          <h2>My Listings</h2>
          <button onClick={() => openModal()} data-primary>
            <i className="fa-solid fa-plus"></i>
            Add Listing
          </button>
        </div>
        <div className="divider"></div>
        <div className="my-listings">
          {userAuctionListings.length > 0 ? (
            userAuctionListings.map((listing) => (
              <div key={listing.id} className="my-listing">
                <h3>{listing.title}</h3>
                <div className="listing-card">
                  {listing.image_ids && listing.image_ids.length > 0 && (
                    <a href={`/listing/${listing.id}`}>
                      <img
                        src={getPublicUrl(
                          listing.user_id,
                          listing.image_ids[0]
                        )}
                        alt="An img"
                      />
                    </a>
                  )}
                  <div className="listing-details">
                    <p>{listing.description}</p>
                    <div className="stats">
                      <span className="start-price">
                        Starting: ${listing.start_price}
                      </span>
                      <span className="increment">
                        Increment: +${listing.increment}
                      </span>
                    </div>
                    <div className="actions">
                      <button onClick={() => openModal(listing)}>
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button onClick={() => deleteListing(listing.id)}>
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>You have no listings</p>
          )}
        </div>
      </div>
      <ListingWizard
        isOpen={isModalOpen}
        onClose={closeModal}
        editListing={selectedListing}
      />
    </div>
  );
}

export default MyListings;
