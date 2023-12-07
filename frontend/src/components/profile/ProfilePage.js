import React, { useState, useEffect } from "react";
import NavigationBar from "../global/NavigationBar";
import { useNavigate, useParams } from "react-router-dom";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import useAuth from "../../lib/auth-hook";
import "./ProfilePage.css";
import { getPublicUrl } from "../../lib/utils";
import Footer from "../mobile/global/footer/Footer";
import { supabase_client } from "../../lib/supabase-client";
import { callServerDbHandler } from "../../lib/fetchServer";

const ProfilePage = () => {
  const { session, loading } = useAuth();

  let { user_id: userIdParams } = useParams();
  const user_id = userIdParams ?? session?.user?.id;

  const is_my_profile = !userIdParams || session?.user?.id === user_id;

  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

  const [profileAuctionListings, setProfileAuctionListings] = useState([]);
  const [highestBidMap, setHighestBidMap] = useState({});

  const profile_user = sparkUsers[user_id];

  useEffect(() => {
    // Filter auctionListings based on user_id

    const highest_bid_map = auctionBids.reduce((map, bid) => {
      if (!map[bid.listing_id] || bid.amount > map[bid.listing_id].amount)
        map[bid.listing_id] = bid;
      return map;
    }, {});

    setHighestBidMap(highest_bid_map);
  }, [auctionBids]);

  useEffect(() => {
    // Filter auctionListings based on user_id
    const filteredListings = auctionListings.filter(
      (listing) => listing.user_id === user_id
    );

    setProfileAuctionListings(filteredListings);
  }, [auctionListings, sparkUsers]);

  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    if (is_my_profile) return;

    const myUser = sparkUsers[session?.user?.id];

    const is_subscribed = myUser?.subscribed_to?.includes(user_id);

    setIsSubscribed(is_subscribed);
  }, [sparkUsers, user_id, is_my_profile, session]);

  const subscribeToUser = async () => {
    if (is_my_profile) return;
    const myUser = sparkUsers[session.user.id];

    const subscribed_users = myUser.subscribed_to
      ? [...myUser.subscribed_to]
      : [];

    subscribed_users.push(user_id);

    const response = await callServerDbHandler({
      from: "profile",
      update: { subscribed_to: subscribed_users },
      eq: ["id", myUser.id],
    });

    const { error } = await response.json();

    if (error) console.error(error);
  };

  const unsubscribeFromUser = async () => {
    if (is_my_profile) return;
    const myUser = sparkUsers[session.user.id];

    const subscribed_users = myUser.subscribed_to
      ? [...myUser.subscribed_to]
      : [];

    const index = subscribed_users.findIndex((id) => id === user_id);
    if (index >= 0) subscribed_users.splice(index, 1);

    const response = await callServerDbHandler({
      from: "profile",
      update: { subscribed_to: subscribed_users },
      eq: ["id", myUser.id],
    });

    const { error } = await response.json();
    if (error) console.error(error);
  };

  return (
    <div className="profile-page-container">
      <NavigationBar />

      <section className="account-info">
        <figure className="profile-img">
          <img
            src={profile_user?.profile_pic ?? "/blank_profile_pic.jpg"}
            alt="user profile picture"
          />
        </figure>

        <section className="personal-info">
          <h2>PERSONAL INFO</h2>
          <h4>NAME: {profile_user?.name ?? "ERROR"}</h4>
          <p>PHONE: {profile_user?.phone ?? "(XXX)-XXX-XXXX"}</p>
          <p>EMAIL: {profile_user?.email ?? "___"}</p>
          {!is_my_profile && !isSubscribed && (
            <button data-primary onClick={() => subscribeToUser()}>
              SUBSCRIBE
            </button>
          )}
          {!is_my_profile && isSubscribed && (
            <button data-primary onClick={() => unsubscribeFromUser()}>
              UNSUBSCRIBE
            </button>
          )}
        </section>
        <section className="about">
          <h2>ABOUT USER</h2>
          <div className="profile-description">
            <p>
              {profile_user?.about ??
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit ut aliquam purus sit amet. Ipsum consequat nisl vel pretium lectus quam id leo in. Bibendum at varius vel pharetra vel turpis nunc eget lorem. Sit amet nulla facilisi morbi. Leo urna molestie at elementum eu facilisis sed. Et netus et malesuada fames ac turpis. Et malesuada fames ac turpis egestas sed. Sed vulputate mi sit amet. Cras adipiscing enim eu turpis egestas pretium aenean pharetra. Sed tempus urna et pharetra pharetra. A diam sollicitudin tempor id eu nisl nunc mi."}
            </p>
          </div>
        </section>
      </section>

      <section className="listings">
        <h1>User Listings</h1>
        <section className="profile-listings">
          {profileAuctionListings.length > 0 ? (
            profileAuctionListings.map((listing) => (
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
                      <span className="current-bid">
                        Current Bid:
                        {highestBidMap[listing.id]
                          ? `$${highestBidMap[listing.id].amount}`
                          : "No bids"}
                      </span>
                    </div>
                    <h4>STATUS: UNSOLD</h4>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>user has no listings</p>
          )}
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default ProfilePage;
