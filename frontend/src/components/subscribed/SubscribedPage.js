import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscribedPage.css";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import Footer from "../mobile/global/footer/Footer";
import ListingCard from "../global/ListingCard";

function SubscribedPage() {
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

  const navigate = useNavigate();

  return (
    <div className="subscribed-page-container">
      <NavigationBar />
      <div className="my-listings-content">
        <div className="my-listings-header">
          <h2>My Described Seller</h2>
        </div>
        <div className="divider"></div>
        <div className="my-listings">
          {Object.keys(listingsByUser).length > 0 ? (
            Object.keys(listingsByUser).map((listing_user_id) => (
              <div key={listing_user_id}>
                <h3>{sparkUsers[listing_user_id].name}</h3>
                <div className="subscribed-user-listings">
                  {listingsByUser[listing_user_id].map((listing) => (
                    <ListingCard listing={listing} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>You are not subscribed to any auctioneers</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SubscribedPage;
