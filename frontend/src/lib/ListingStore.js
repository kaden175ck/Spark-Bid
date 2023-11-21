import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase_client } from "./supabase-client";

// Creating a Context for the auction listings
const AuctionContext = createContext();

// Provider component
export const AuctionProvider = ({ children }) => {
  const [auctionListings, setAuctionListings] = useState([]);

  // Function to fetch auction listings
  const fetchAuctionListings = async () => {
    let { data: auction_listing, error } = await supabase_client
      .from("auction_listing")
      .select("*, images_for_listing(*, images(*))");

    if (error) {
      console.error("Error fetching auction listings:", error);
      return;
    }

    setAuctionListings(auction_listing);
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

    const image_channel = supabase_client
      .channel("images-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "images_for_listing" },
        (payload) => {
          fetchAuctionListings();
        }
      )
      .subscribe();

    // Fetch initial data
    fetchAuctionListings();

    // Cleanup function
    return () => {
      listing_channel.unsubscribe();
      image_channel.unsubscribe();
    };
  }, []);

  return (
    <AuctionContext.Provider value={{ auctionListings }}>
      {children}
    </AuctionContext.Provider>
  );
};

// Custom hook to use the auction store
export const useAuctionStore = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error("useAuctionStore must be used within a AuctionProvider");
  }
  return context;
};
