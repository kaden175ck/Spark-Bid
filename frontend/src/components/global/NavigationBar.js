import ListingSearch from "../search/ListingSearch";
import "./NavigationBar.css";
import { useNavigate } from "react-router-dom";
import { supabase_client } from "../../lib/supabase-client";

function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase_client.auth.signOut();
    console.log(error);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="NavigationBar">
      <section className="desktop-content">
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
          <i
            className="fa-solid fa-user button"
            onClick={() => navigate("/profile")}
          ></i>
        </section>
        <section id="nav-logout">
          <i
            className="fa-solid fa-right-from-bracket button"
            onClick={handleLogout}
          ></i>
        </section>
      </section>
      <section className="mobile-content">
        <h3>Featured Items</h3>
        <section id="nav-logout" style={{ marginLeft: "auto" }}>
          <i
            className="fa-solid fa-right-from-bracket button"
            onClick={handleLogout}
          ></i>
        </section>
      </section>
    </div>
  );
}

export default NavigationBar;
