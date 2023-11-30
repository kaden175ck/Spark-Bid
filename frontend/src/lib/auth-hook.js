import { useState, useEffect } from "react";
import { supabase_client } from "./supabase-client";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    // Inner async function
    const checkAuth = async () => {
      const { data, error } = await supabase_client.auth.getSession();
      if (error) setAuthenticated(null);
      if (data?.session) {
        setAuthenticated(data.session);
      }
    };

    // Call the inner function
    checkAuth();

    // Set up the auth state change listener
    const { data: listener } = supabase_client.auth.onAuthStateChange(
      (data, session) => setAuthenticated(session ? session : null)
    );

    // Cleanup function
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return authenticated;
};

export default useAuth;
