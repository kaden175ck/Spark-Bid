import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListingCard.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "./../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import { formatDateForLocal, getPublicUrl } from "../../lib/utils";
import Footer from "../mobile/global/footer/Footer";

function ListingCard({ children, listing }) {
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

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Function to calculate time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const finishTime = new Date(formatDateForLocal(listing.finish_at));
      const difference = finishTime - now;

      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    // Update the time left immediately and every second
    const updateTimer = () => {
      const time = calculateTimeLeft();
      const formattedTime = `${time.days || 0}d ${time.hours || 0}h ${
        time.minutes || 0
      }m ${time.seconds || 0}s`;
      setTimeLeft(formattedTime);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [listing.finish_at]);

  if (!listing) return <div>Invalid Listing...</div>;
  return (
    <div className="listing-card">
      {listing.image_ids && listing.image_ids.length > 0 && (
        <a href={`/listing/${listing.id}`} data-nostyle>
          <img
            src={getPublicUrl(listing.user_id, listing.image_ids[0])}
            alt="An img"
          />
        </a>
      )}
      <div className="listing-card-body">
        <h3>{listing.title}</h3>
        <p>{listing.description}</p>
        <div className="listing-card-detail listing-card-green">
          <span>Highest Bid:</span>
          <span>
            {highestBidMap[listing.id]
              ? `$${highestBidMap[listing.id].amount}`
              : "No Bids"}
          </span>
        </div>
        <div className="listing-card-detail listing-card-green">
          <span>Starting:</span>
          <span>${listing.start_price}</span>
        </div>
        <div className="listing-card-detail listing-card-green">
          <span>Increment: </span>
          <span>+${listing.increment}</span>
        </div>
        <div className="listing-card-detail listing-card-red">
          <span>Time Left </span>
          <span>{timeLeft}</span>
        </div>
        {listing.is_sold && (
          <div className="sold-overlay">
            <span className="overlay-text">SOLD</span>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default ListingCard;
