import ListingSearch from "../search/ListingSearch";
import "./NavigationBar.css";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();

  return (
    <div className="NavigationBar">
      <img src="/SparkBid.png" alt="SparkBid Logo" className="logo" />
      <section>
        <div className="nav-item" onClick={() => navigate("/home")}>
          <i className="fa-solid fa-house"></i>
          Home
        </div>
        <div className="nav-item" onClick={() => navigate("/my-listings")}>
          <i className="fa-solid fa-gavel"></i>
          Listings
        </div>
        <div className="nav-item" onClick={() => navigate("/home")}>
          <i className="fa-solid fa-money-bills"></i>
          Bids
        </div>
        <div className="nav-item" onClick={() => navigate("/home")}>
          <i className="fa-solid fa-newspaper"></i>
          Seller
        </div>
      </section>
      <section id="nav-search">
        <i className="fa-solid fa-magnifying-glass button"></i>
        <ListingSearch></ListingSearch>
      </section>
      <section id="nav-profile">
        <i className="fa-solid fa-user button"></i>
      </section>
    </div>
  );
}

export default NavigationBar;
