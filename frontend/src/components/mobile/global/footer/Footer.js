import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  return (
    <section className="Footer">
      <button onClick={() => navigate("/home")}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <br />
        Search
      </button>
      <button onClick={() => navigate("/my-listings")}>
        <i className="fa-solid fa-gavel"></i>
        <br />
        Listings
      </button>
      <button onClick={() => navigate("/home")}>
        <i className="fa-solid fa-house"></i>
        <br />
        Home
      </button>
      <button onClick={() => navigate("/bids")}>
        <i className="fa-solid fa-money-bills"></i>
        <br />
        Bidding
      </button>
      <button onClick={() => navigate("/profile")}>
        <i className="fa-solid fa-user"></i>
        <br />
        Profile
      </button>
    </section>
  );
}

export default Footer;
