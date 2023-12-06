import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBids.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "./../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";


function MyBids() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState({});
  const openModal = (listing = {}) => {
    setSelectedBid(listing);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedBid({});
    setIsModalOpen(false);
  };

  const { session, loading } = useAuth();

  const user_id = session?.user?.id;

  const { auctionBids } = useSparkBidContext();

  const [userAuctionBids, setUserAuctionBids] = useState([]);

  useEffect(() => {
    // Filter auctionBids based on user_id
    const filteredBids = auctionBids.filter(
      (listing) => listing.user_id === user_id
    );

    setUserAuctionBids(filteredBids);
  }, [auctionBids, user_id]);

  const navigate = useNavigate();

  const deleteBid = async (listing_id) => {
    let { error } = await supabase_client
      .from("auction_bid")
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
    <div className="my-bids-container">
      <NavigationBar />
      <div className="my-bids-content">
        <div className="my-bids-header">
          <h2>My Bids</h2>
        </div>
        <div className="divider"></div>
        <div className="my-bids">
          {userAuctionBids.length > 0 ? (
            userAuctionBids.map((listing) => (
              <div key={listing.id} className="my-bid">
                <h3>{listing.title}</h3>
                <div className="listing-card">
                  {listing.images && listing.images.length > 0 && (
                    <a href={`/listing/${listing.id}`}>
                      <img src={listing.images[0]} alt="An img" />
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
                      <button onClick={() => deleteBid(listing.id)}>
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>You have no bids</p>
          )}
        </div>
      </div>
      <ListingWizard
        isOpen={isModalOpen}
        onClose={closeModal}
        editListing={selectedBid}
      />
    </div>
  );
}

export default MyBids;