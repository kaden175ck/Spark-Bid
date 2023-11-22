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

function App() {
  const authenticated = useAuth();

  return (
    <AuctionProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              authenticated ? <Navigate to="/dashboard" /> : <LoginForm />
            }
          />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route
            path="/dashboard"
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/listing" element={<UserBids />} />
        </Routes>
      </Router>
    </AuctionProvider>
  );
}

export default App;
