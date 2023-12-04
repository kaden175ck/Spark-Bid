import { useState, useEffect } from "react";
import { supabase_client } from "./supabase-client";

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    // Function to update the authentication state
    const updateAuthState = (sess) => {
      setSession(sess ? sess : null);
      setLoading(false); // Set loading to false after updating auth state
    };

    // Immediately check the current authentication state
    supabase_client.auth.getSession().then(({ data, error }) => {
      if (error) {
        updateAuthState(null);
      } else {
        updateAuthState(data?.session);
      }
    });

    // Subscribe to auth state changes
    const { data: listener } = supabase_client.auth.onAuthStateChange(
      (event, session) => {
        updateAuthState(session);
      }
    );

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  return { session, loading };
};

export default useAuth;
