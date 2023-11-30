import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ListingPage.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "../ListingWizard";
import { useAuctionStore } from "../../lib/ListingStore";
import FeaturedItem from "../home/FeaturedItem";
import NavigationBar from "../global/NavigationBar";
import useAuth from "../../lib/auth-hook";

function ListingPage() {
  const { listing_id } = useParams();

  const [activeListing, setActiveListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState({});

  const { auctionListings } = useAuctionStore();

  useEffect(() => {
    // Filter auctionListings based on user_id
    const listing = auctionListings.find(
      (listing) => listing.id === listing_id
    );

    setActiveListing(listing);
  }, [auctionListings, listing_id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (listing = {}) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedListing({});
    setIsModalOpen(false);
  };

  const session = useAuth();

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
        <FeaturedItem listing={activeListing}></FeaturedItem>
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
