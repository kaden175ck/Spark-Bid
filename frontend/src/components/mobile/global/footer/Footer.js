import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="Footer">
      <button
        onClick={() => navigate("/search")}
        className={
          location.pathname.startsWith("/search") ? "active-button" : ""
        }
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <br />
        Search
      </button>
      <button
        onClick={() => navigate("/my-listings")}
        className={
          location.pathname.startsWith("/my-listings") ? "active-button" : ""
        }
      >
        <i className="fa-solid fa-gavel"></i>
        <br />
        Listings
      </button>
      <button
        onClick={() => navigate("/home")}
        className={location.pathname.startsWith("/home") ? "active-button" : ""}
      >
        <i className="fa-solid fa-house"></i>
        <br />
        Home
      </button>
      <button
        onClick={() => navigate("/my-bids")}
        className={
          location.pathname.startsWith("/my-bids") ? "active-button" : ""
        }
      >
        <i className="fa-solid fa-money-bills"></i>
        <br />
        Bids
      </button>
      <button
        onClick={() => navigate("/profile")}
        className={
          location.pathname.startsWith("/profile") ? "active-button" : ""
        }
      >
        <i className="fa-solid fa-user"></i>
        <br />
        Profile
      </button>
    </section>
  );
}

export default Footer;
