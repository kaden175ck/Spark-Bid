import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ListingPage.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import FeaturedItem from "../home/FeaturedItem";
import NavigationBar from "../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import BidPanel from "./BidPanel";

function ListingPage() {
  const { listing_id } = useParams();

  const { session, loading } = useAuth();

  const user_id = session?.user?.id;

  const [highestBid, setHighestBid] = useState({});
  const [activeListing, setActiveListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState({});

  const [listingBids, setListingBids] = useState([]);

  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

  useEffect(() => {
    // Filter auctionListings based on user_id
    const listing = auctionListings.find(
      (listing) => listing.id === listing_id
    );

    setActiveListing(listing);
  }, [auctionListings, listing_id]);

  useEffect(() => {
    const bids = auctionBids.filter((bid) => bid.listing_id === listing_id);

    const highest_bid = bids.reduce(
      (max, bid) => (bid.amount > max.amount ? bid : max),
      bids[0]
    );

    setListingBids(bids);
    setHighestBid(highest_bid);
  }, [auctionBids, listing_id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (listing = {}) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedListing({});
    setIsModalOpen(false);
  };

  const [userAuctionListings, setUserAuctionListings] = useState([]);

  const navigate = useNavigate();

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

  if (!activeListing) return <div>Loading...</div>;

  return (
    <div className="listing-page-container">
      <NavigationBar />
      <div className="listing-page">
        <h1>{activeListing.title}</h1>
        <FeaturedItem
          listing={activeListing}
          bids={listingBids}
          users={sparkUsers}
        ></FeaturedItem>
        <div>
          {activeListing.user_id === user_id ? (
            <div>
              <button onClick={() => openModal(activeListing)}>
                <i className="fa-solid fa-pen-to-square"></i> Edit
              </button>
            </div>
          ) : (
            <div>
              <BidPanel listing_id={activeListing.id}></BidPanel>
            </div>
          )}
        </div>
        <div className="bid-history">
          History
          {listingBids.length > 0 ? (
            listingBids.map((bid) => (
              <div key={bid.id} className="history-item">
                <div>{sparkUsers[bid.user_id]?.name ?? "Unknown User"}</div>
                <div>{bid.amount}</div>
              </div>
            ))
          ) : (
            <p>There are no bids</p>
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

export default ListingPage;
