import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL fragment
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      navigate("/home");
    } else {
      // If there's no token, navigate back to the login or home page
      navigate("/login");
    }
  }, [navigate]);

  return <div>Confirming...</div>;
}

export default ConfirmationPage;
