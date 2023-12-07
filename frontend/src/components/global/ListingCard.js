import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListingCard.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "./../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import { getPublicUrl } from "../../lib/utils";
import Footer from "../mobile/global/footer/Footer";

function ListingCard({ listing }) {
  const { session, loading } = useAuth();

  const user_id = session?.user?.id;

  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

  const [myUser, setMyUser] = useState({});
  const [listingsByUser, setListingsByUser] = useState({});
  useEffect(() => {
    const my_user = sparkUsers[user_id];
    console.log(my_user);
    if (!my_user) return;

    const subscribed_ids = my_user.subscribed_to ?? [];

    const listings_by_user = auctionListings.reduce((map, listing) => {
      if (!subscribed_ids.includes(listing.user_id)) return map;

      if (!map[listing.user_id]) map[listing.user_id] = [];
      map[listing.user_id].push(listing);
      return map;
    }, {});

    setListingsByUser(listings_by_user);
    setMyUser(my_user);
  }, [auctionListings, sparkUsers, user_id]);

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

  if (!listing) return <div>Invalid Listing...</div>;
  return (
    <div className="listing">
      <h3>{listing.title}</h3>
      {listing.image_ids && listing.image_ids.length > 0 && (
        <a href={`/listing/${listing.id}`} data-nostyle>
          <img
            src={getPublicUrl(listing.user_id, listing.image_ids[0])}
            alt="An img"
          />
        </a>
      )}
      <p>{listing.description}</p>
      <div className="details">
        <span className="start-price">
          Highest Bid:{" "}
          {highestBidMap[listing.id]
            ? `$${highestBidMap[listing.id].amount}`
            : "No Bids"}
        </span>
        <span className="start-price">Starting: ${listing.start_price}</span>
        <span className="increment">Increment: +${listing.increment}</span>
      </div>
    </div>
  );
}

export default ListingCard;
