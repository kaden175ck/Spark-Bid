import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ListingPage.css";
import ListingWizard from "../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import FeaturedItem from "../home/FeaturedItem";
import NavigationBar from "../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import BidPanel from "./BidPanel";
import Footer from "../mobile/global/footer/Footer";

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
    const bids = auctionBids
      .filter((bid) => bid.listing_id === listing_id)
      .sort((b1, b2) => b2.amount - b1.amount);

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
        <h3>History</h3>
        <div className="bid-history">
          {listingBids.length > 0 ? (
            listingBids.map((bid) => (
              <div key={bid.id} className="history-item">
                <a href={`/profile/${bid.user_id}`} data-nostyle>
                  <div>{sparkUsers[bid.user_id]?.name ?? "Unknown User"}</div>
                </a>
                <div className="bid-amount">${bid.amount}</div>
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
      <Footer />
    </div>
  );
}

export default ListingPage;
