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

function App() {
  const authenticated = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/dashboard" /> : <LoginForm />}
        />
        <Route path="/signup" element={<RegistrationForm />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
        <Route
          path="/dashboard"
          element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
