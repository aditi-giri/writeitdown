import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span
          className="navbar-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          WriteItDown
        </span>

      </div>

      <div className="navbar-right">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-button">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/journal">New Entry</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/analytics">Insights</Link>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
