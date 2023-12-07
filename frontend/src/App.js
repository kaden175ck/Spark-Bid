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
import { SparkBidContextProvider } from "./lib/SparkBidStore";
import UserBids from "./components/UserBids";
import MyListings from "./components/my-listings/MyListings";
import ListingPage from "./components/listing/ListingPage";
import SearchPage from "./components/search/SearchPage";
import ProfilePage from "./components/profile/ProfilePage";
import SubscribedPage from "./components/subscribed/SubscribedPage";
import MyBids from "./components/my-bids/MyBids";

function App() {
  const { session, loading } = useAuth();

  // Render a loading indicator or a blank page while checking auth status
  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return (
    <SparkBidContextProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={session ? <Navigate to="/home" /> : <LoginForm />}
          />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route
            path="/home"
            element={session ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-listings"
            element={session ? <MyListings /> : <Navigate to="/login" />}
          />
          <Route
            path="/listing/:listing_id"
            element={session ? <ListingPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={session ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:user_id"
            element={session ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={session ? <SearchPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/subscribed-page"
            element={session ? <SubscribedPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/search/:query"
            element={session ? <SearchPage /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/listing" element={<UserBids />} />
          <Route
            path="/my-bids"
            element={session ? <MyBids /> : <Navigate to="/login" />}
          />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </SparkBidContextProvider>
  );
}
export default App;
