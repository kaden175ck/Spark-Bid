import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBids.css";
import { supabase_client } from "../../lib/supabase-client";
import { fetchServer } from "../../lib/fetchServer";
import ListingWizard from "./../ListingWizard";
import { useSparkBidContext } from "../../lib/SparkBidStore";
import NavigationBar from "./../global/NavigationBar";
import useAuth from "../../lib/auth-hook";
import { getPublicUrl } from "../../lib/utils";

function MyBids() {

  const { session, loading } = useAuth();

  const user_id = session?.user?.id;

  const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

  const [userAuctionBidListings, setUserAuctionBidListings] = useState([]);

  useEffect(() => {
    // Filter auctionBids based on user_id
    const filteredBids = auctionBids.reduce((bids, bid) => {
        if(bid.user_id != user_id) return bids
        const index = bids.findIndex(b => b.listing_id === bid.listing_id)
        if(index > 0 && bid.amount > bids[index].amount)
        bids[index] = bid
        else if (index == -1)
        bids.push(bid)
        return bids
        }, [])
        
        const listingIds = filteredBids.map(b => b.listing_id)
        
        const myBidListings = auctionListings.filter(l => listingIds.includes(l.id))
    console.log(myBidListings);
    setUserAuctionBidListings(myBidListings);
  }, [auctionBids, user_id]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase_client.auth.signOut();
    console.log(error);
    navigate("/login"); // Redirect to login after logout
  };

//   const highest_bid = bids.reduce(
//     (max, bid) => (bid.amount > max.amount ? bid : max),
//     bids[0]
//   );

  return (
    <div className="my-bids-container">
      <NavigationBar />
      <div className="my-bids-content">
        <div className="my-bids-header">
          <h2>My Bids</h2>
        </div>
        <div className="divider"></div>
        <div className="my-bids">
          {userAuctionBidListings.length > 0 ? (
            userAuctionBidListings.map((listing) => (
                <div key={listing.id} className="my-bid">
                    <h3>{listing.title}</h3>
                    <div className="listing-card">
                        <div className="item-description">
                            <p>{listing.description}</p>
                            <div className="stats">
                                {/* <span className="start-price">
                                    Starting: ${listing.start_price}
                                </span><br/>
                                <span className="increment">
                                    Increment: +${listing.increment}
                                </span> */}
                                <span className="seller">
                                    Seller: <br />
                                    {listing?.user_id ?? "Unknown User"}
                                </span>
                                
                            </div>
                            
                            <div className="actions">
                            {/* Add your action buttons here */}
                            </div>
                        </div>
                        {listing.image_ids && listing.image_ids.length > 0 && (
                            <a href={`/listing/${listing.id}`}>
                            <img
                                src={getPublicUrl(listing.user_id, listing.image_ids[0])}
                                alt="An img"
                            />
                            </a>
                        )}
                        <div className="bid-info">
                            {/* <p>
                                Current Bid: <br />
                                {highest_bid ? `$${highest_bid.amount}` : "No bids"}
                            </p>
                            <p>
                                Increment: <br />
                                <span style={{ color: "var(--success)" }}>
                                    +${listing.increment}
                                </span>
                            </p>
                            <p>
                                Starting Bid: <br />
                                <span style={{ color: "var(--success)" }}>
                                    ${listing.start_price}
                                </span>
                            </p>
                            <p>
                                Time Left: <br />
                                <span style={{ color: "var(--error)" }}>
                                    {"{listing time left}"}
                                </span>
                            </p> */}
                        </div>
                    </div>
              </div>
            ))
          ) : (
            <p>You have no bids</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBids;