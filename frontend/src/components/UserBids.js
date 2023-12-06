import React, { useState, useEffect } from 'react';
import NavigationBar from './global/NavigationBar';
import { supabase_client } from '../lib/supabase-client';
import useAuth from '../lib/auth-hook';

function UserBids() {
  const [userBids, setUserBids] = useState([]);
  const { session } = useAuth();
  const user_id = session?.user?.id;

  useEffect(() => {
      const fetchUserBids = async () => {
          console.log('Fetching bids for user:', user_id); // Debugging log
          try {
              const { data, error } = await supabase_client
                  .from('bid_on_listing')
                  .select('*')
                  .eq('user_id', user_id);

              if (error) throw error;
              console.log('Fetched bids:', data); // Debugging log
              setUserBids(data);
          } catch (error) {
              console.error('Error fetching user bids:', error.message);
          }
      };

      if (user_id) {
          fetchUserBids();
      }
  }, [user_id]);

  return (
      <div>
          <NavigationBar />
          <div className="user-bids-container">
              <h1>Your Bids</h1>
              {userBids.length > 0 ? (
                  userBids.map(bid => (
                      <div key={bid.id} className="bid-item">
                          <p>Listing Title: {bid.listing_title}</p>
                          <p>Bid Amount: {bid.amount}</p>
                      </div>
                  ))
              ) : (
                  <p>You have not placed any bids yet.</p>
              )}
          </div>
      </div>
  );
}

export default UserBids;

