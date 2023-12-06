import React, {useState, useEffect} from 'react';
import NavigationBar from './global/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useSparkBidContext } from "../lib/SparkBidStore";
import useAuth from '../lib/auth-hook';
import './UserProfile.css';

const UserProfile = () => {
    const { session, loading } = useAuth();

    const user_id = session?.user?.id;

    const { auctionListings, auctionBids, sparkUsers } = useSparkBidContext();

    const [userAuctionListings, setUserAuctionListings] = useState([]);

    const highest_bid = auctionBids.reduce(
        (max, bid) => (bid.amount > max.amount ? bid : max),
        auctionBids[0]
      );

    useEffect(() => {
        // Filter auctionListings based on user_id
        const filteredListings = auctionListings.filter(
        (listing) => listing.user_id === user_id
        );

        setUserAuctionListings(filteredListings);
    }, [auctionListings, user_id]);

    const navigate = useNavigate();

    const activeUser = sparkUsers[user_id];

    return (
        <div className='user-profile-container'>
            <NavigationBar />

            <section class='account-info'>
                <figure className='profile-img'>
                    <img src={activeUser?.profile_pic ?? '/blank_profile_pic.jpg'} alt="user profile picture" />
                </figure>
                
                <section className='personal-info'>
                    <h2>PERSONAL INFO</h2>
                    <h4>NAME: {activeUser?.name ?? "ERROR"}</h4>
                    <p>PHONE: </p>
                    <p>EMAIL: {activeUser?.email ?? "ERROR"}</p>
                </section>
                <section className='about'>
                    <h2>ABOUT USER</h2>
                    <div className='profile-description'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit ut aliquam purus sit amet. Ipsum consequat nisl vel pretium lectus quam id leo in. Bibendum at varius vel pharetra vel turpis nunc eget lorem. Sit amet nulla facilisi morbi. Leo urna molestie at elementum eu facilisis sed. Et netus et malesuada fames ac turpis. Et malesuada fames ac turpis egestas sed. Sed vulputate mi sit amet. Cras adipiscing enim eu turpis egestas pretium aenean pharetra. Sed tempus urna et pharetra pharetra. A diam sollicitudin tempor id eu nisl nunc mi.</p>
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
                                {listing.images && listing.images.length > 0 && (
                                    <a href={`/listing/${listing.id}`}>
                                    <img src={listing.images[0]} alt="An img" />
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

            <section id='bids'>
                <h2>MY BIDS PLACEHOLDER</h2>
                {/*Place trimmed bids module here when ready*/}
            </section>
        </div>
    );
}

export default UserProfile;