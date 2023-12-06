import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from './global/NavigationBar';
import { useSparkBidContext } from "../lib/SparkBidStore";
import useAuth from '../lib/auth-hook';
import './UserProfile.css';
import { getPublicUrl } from '../lib/utils';

const UserProfile = () => {
    const { session, loading } = useAuth();
    const params = useParams();
    const userProfileId = params.user_id || session?.user?.id; // Get user ID from URL or use logged-in user's ID

    const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

    const [userAuctionListings, setUserAuctionListings] = useState([]);

    useEffect(() => {
        // Filter auctionListings based on userProfileId
        const filteredListings = auctionListings.filter(
            (listing) => listing.user_id === userProfileId
        );

        setUserAuctionListings(filteredListings);
    }, [auctionListings, userProfileId]);

    const navigate = useNavigate();

    const activeUser = sparkUsers[userProfileId]; // Use userProfileId

    // Determine the highest bid for the user's auction listings
    const highest_bid = auctionBids.reduce(
        (max, bid) => (bid.amount > max.amount ? bid : max),
        auctionBids[0]
    );

    return (
        <div className='user-profile-container'>
            <NavigationBar />

            <section className='account-info'>
                <figure className='profile-img'>
                    <img src={activeUser?.profile_pic ?? '/blank_profile_pic.jpg'} alt="user profile picture" />
                </figure>
                
                <section className='personal-info'>
                    <h2>PERSONAL INFO</h2>
                    <h4>NAME: {activeUser?.name ?? "ERROR"}</h4>
                    <p>PHONE: {activeUser?.phone ?? "___"}</p>
                    <p>EMAIL: {activeUser?.email ?? "___"}</p>
                </section>
                <section className='about'>
                    <h2>ABOUT USER</h2>
                    <div className='profile-description'>
                        <p>{activeUser?.about ?? "User description not available"}</p>
                    </div>
                </section>
            </section>

            <section className='listings'>
                <h1>My Listings</h1>
                <section className='profile-listings'>
                    {userAuctionListings.length > 0 ? (
                        userAuctionListings.slice(0, 3).map((listing) => (
                            <div key={listing.id} className="my-listing">
                                <h3>{listing.title}</h3>
                                <div className="listing-card">
                                    {listing.image_ids && listing.image_ids.length > 0 && (
                                        <a href={`/listing/${listing.id}`}>
                                            <img src={getPublicUrl(listing.user_id, listing.image_ids[0])} alt="Listing image" />
                                        </a>
                                    )}
                                    <div className="listing-details">
                                        <p>{listing.description}</p>
                                        <div className="stats">
                                            <span className="current-bid">
                                                Current Bid: ${highest_bid ? `${highest_bid.amount}` : "No bids"}
                                            </span>
                                        </div>
                                        <h4>STATUS: UNSOLD</h4>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>You have no listings</p>
                    )}
                </section>
                <button className='listings-button' onClick={() => navigate('/my-listings')}>All listings</button>
            </section>

            {/* Other sections like bids, subscribed sellers, and bid history */}
            {/* ... */}

        </div>
    );
}

export default UserProfile;
