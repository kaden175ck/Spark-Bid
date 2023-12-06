import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <section className="Footer">
      <button onClick={() => navigate("/home")}>
        <i className="fa-solid fa-house"></i>
        Home
      </button>
      <button onClick={() => navigate("/my-listings")}>
        <i className="fa-solid fa-gavel"></i>
        Listings
      </button>
      <button onClick={() => navigate("/home")}>
        <i className="fa-solid fa-money-bills"></i>
        Bids
      </button>
      <button onClick={() => navigate("/home")}>
        <i className="fa-solid fa-newspaper"></i>
        Subscribed
      </button>
    </section>
  );
}

export default Footer;
