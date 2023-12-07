import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase_client } from "./supabase-client";
import { callServerDbHandler } from "./fetchServer";

// Creating a Context for the auction listings
const SparkBidContext = createContext();

// Provider component
export const SparkBidContextProvider = ({ children }) => {
  const [auctionListings, setAuctionListings] = useState([]);

  // Function to fetch auction listings
  const fetchAuctionListings = async () => {
    const response = await callServerDbHandler({
      from: "auction_listing",
      select: "*",
    });

    const { data: auction_listing, error } = await response.json();

    if (error) {
      console.error("Error fetching auction listings:", error.details);
      return;
    }

    setAuctionListings(auction_listing);
  };

  const [auctionBids, setAuctionBids] = useState([]);

  // Function to fetch auction bids
  const fetchAuctionBids = async () => {
    const response = await callServerDbHandler({
      from: "bid_on_listing",
      select: "*",
    });

    const { data: bid_on_listing, error } = await response.json();

    if (error) {
      console.error("Error fetching bids on listings:", error.details);
      return;
    }

    setAuctionBids(bid_on_listing);
  };

  const [sparkUsers, setSparkUsers] = useState({});

  // Function to fetch auction bids
  const fetchSparkUsers = async () => {
    const response = await callServerDbHandler({
      from: "profile",
      select: "*",
    });

    const { data: spark_users, error } = await response.json();

    if (error) {
      console.error("Error fetching users:", error.details);
      return;
    }

    const user_map = spark_users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {});

    setSparkUsers(user_map);
  };

  // Subscribe to changes in the auction_listing table
  useEffect(() => {
    const listing_channel = supabase_client
      .channel("listing-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_listing" },
        (payload) => {
          fetchAuctionListings();
        }
      )
      .subscribe();

    const bid_channel = supabase_client
      .channel("bid-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bid_on_listing" },
        (payload) => {
          fetchAuctionBids();
        }
      )
      .subscribe();

    const profile_channel = supabase_client
      .channel("profile_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        (payload) => {
          fetchSparkUsers();
        }
      )
      .subscribe();

    // Fetch initial data
    fetchAuctionListings();
    fetchAuctionBids();
    fetchSparkUsers();

    // Cleanup function
    return () => {
      profile_channel.unsubscribe();
      listing_channel.unsubscribe();
      bid_channel.unsubscribe();
    };
  }, []);

  return (
    <SparkBidContext.Provider
      value={{ auctionListings, auctionBids, sparkUsers }}
    >
      {children}
    </SparkBidContext.Provider>
  );
};

// Custom hook to use the auction store
export const useSparkBidContext = () => {
  const context = useContext(SparkBidContext);
  if (context === undefined) {
    throw new Error(
      "useSparkBidContext must be used within a SparkBidContextProvider"
    );
  }
  return context;
};
