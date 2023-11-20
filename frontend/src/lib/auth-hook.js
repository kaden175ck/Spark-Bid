import { useState, useEffect } from "react";
import { supabase_client } from "./supabase-client";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Inner async function
    const checkAuth = async () => {
      const { data, error } = await supabase_client.auth.getSession();
      if (error) setAuthenticated(false);
      if (data?.session) {
        console.log(data.session);
        setAuthenticated(true);
      }
    };

    // Call the inner function
    checkAuth();

    // Set up the auth state change listener
    const { data: listener } = supabase_client.auth.onAuthStateChange(
      (_, session) => setAuthenticated(session ? true : false)
    );

    // Cleanup function
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return authenticated;
};

export default useAuth;
