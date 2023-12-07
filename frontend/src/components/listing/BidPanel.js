import React, { useState, useEffect } from "react";
import "./BidPanel.css";
import { callServerDbHandler } from "../../lib/fetchServer";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import useAuth from "../../lib/auth-hook";

function BidPanel({ listing_id }) {
  const [formData, setFormData] = useState({
    amount: 0.0,
  });

  const { session, loading } = useAuth();
  const user_id = session?.user?.id;

  const [highestBid, setHighestBid] = useState({});
  const [listingBids, setListingBids] = useState([]);
  const [selectedListing, setSelectedListing] = useState({});

  const { auctionListings, auctionBids } = useSparkBidContext();

  useEffect(() => {
    const listing = auctionListings.find(
      (listing) => listing.id === listing_id
    );
    const bids = auctionBids.filter((bid) => bid.listing_id === listing_id);
    const highest_bid = bids.reduce(
      (max, bid) => (bid.amount > max.amount ? bid : max),
      bids[0]
    );

    setListingBids(bids);
    setHighestBid(highest_bid);
    setSelectedListing(listing);
  }, [auctionBids, auctionListings, listing_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const quickBid = async () => {
    const amount = highestBid
      ? highestBid.amount + selectedListing.increment
      : selectedListing.start_price;

    if (!amount) return;

    await placeBid(amount);
  };

  const handlePlaceBid = async (event) => {
    event.preventDefault();

    if (!formData.amount) return;

    await placeBid(formData.amount);

    setFormData({
      amount: 0.0,
    });
  };

  const placeBid = async (amount) => {
    const response = await callServerDbHandler({
      from: "bid_on_listing",
      insert: {
        user_id,
        listing_id: listing_id,
        amount: amount,
      },
    });

    const { error } = await response.json();
    if (error) console.error(error);
  };

  return (
    <div className="bid-panel-container">
      <div className="bid-panel">
        <div className="bid-to-beat">
          <h3>Bid to beat</h3>
          <span>{highestBid ? `$${highestBid.amount}` : "No bids"}</span>
        </div>
        <div className="place-bid">
          <button className="quick-bid" onClick={quickBid}>
            Quick Bid: $
            {highestBid
              ? highestBid.amount + selectedListing.increment
              : selectedListing.start_price}
          </button>
          <form onSubmit={handlePlaceBid}>
            <input
              required
              name="amount"
              className="place-bid-input"
              placeholder="$ Bid Amount..."
              value={formData.amount}
              onChange={handleChange}
            ></input>
            <button type="submit" className="place-bid-btn" data-primary>
              Place Bid
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BidPanel;
