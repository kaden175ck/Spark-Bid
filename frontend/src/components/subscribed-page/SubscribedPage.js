import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscribedPage.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "./../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import { getPublicUrl } from "../../lib/utils";
import Footer from "../mobile/global/footer/Footer";

function SubscribedPage() {
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
  console.log(user_id);

  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();
  console.log(sparkUsers);

  const activeUser = sparkUsers[user_id];
  const describedSellerList = activeUser?.described_seller;
  
  console.log(activeUser?.described_seller);

  const [describedSellerListing, setDescribedSellerListing] = useState([]);
  console.log(describedSellerListing);


  useEffect(() => {
    // Filter auctionListings based on user_id
    const filteredListings = auctionListings.filter(
      (listing) => listing.user_id === user_id
    );

    setDescribedSellerListing(filteredListings);
  }, [auctionListings, user_id]);

  const navigate = useNavigate();

  const updateDescribedListing = async (listing_id) => {
    let updateList = [];
    for(let i = 0; describedSellerList[i] !== null; i++){
        if(describedSellerList[i] !== listing_id)
            updateList.push(describedSellerList[i]);
    }

    const { data, error } = await supabase_client
    .from('profile')
    .update({ described_seller: updateList })
    .eq('id', activeUser)
    .select()
        
  };


  return (
    <div className="my-listings-container">
      <NavigationBar />
      <div className="my-listings-content">
        <div className="my-listings-header">
          <h2>My Described Seller</h2>
        </div>
        <div className="divider"></div>
        <div className="my-listings">
          {activeUser?.described_seller !== null ? (
            describedSellerListing.map((listing) => (
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
                      <button onClick={() => updateDescribedListing(listing.id)}>
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
      <Footer />
    </div>
  );
}

export default SubscribedPage;
