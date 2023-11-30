import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ConfirmationPage from "./components/ConfirmationPage";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./components/Dashboard";
import useAuth from "./lib/auth-hook";
import { AuctionProvider } from "./lib/ListingStore";
import UserBids from "./components/UserBids";
import MyListings from "./components/my-listings/MyListings";
import ListingPage from "./components/listing/ListingPage";

function App() {
  const { authenticated, loading } = useAuth();

  // Render a loading indicator or a blank page while checking auth status
  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return (
    <AuctionProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={authenticated ? <Navigate to="/home" /> : <LoginForm />}
          />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route
            path="/home"
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-listings"
            element={authenticated ? <MyListings /> : <Navigate to="/login" />}
          />
          <Route
            path="/listing/:listing_id"
            element={authenticated ? <ListingPage /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/listing" element={<UserBids />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </AuctionProvider>
  );
}
export default App;
