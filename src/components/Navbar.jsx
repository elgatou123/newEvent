import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    console.log("Parsed user from localStorage:", parsed);
    setUser({
      fullName: parsed.user?.name || "No Name",
      userType: (parsed.role || "").toLowerCase(),
      email: parsed.user?.email || "",
    });
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);  
    navigate("/");
  };


  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo-link">
            <span className="logo-text">EventVerse</span>
          </Link>

          {/* Desktop navigation */}
          <div className="desktop-menu">
            <Link to="/" className="nav-link">
              Accueil
            </Link>
            <Link to="/events" className="nav-link">
              Événements
            </Link>
            {user ? (
              <>
                {user.userType?.trim().toLowerCase() === "guest" && (
                  <Link to="/my-reservations" className="nav-link">
                    Mes Réservations
                  </Link>
                )}
            <Link to="/about" className="nav-link">
              À propos
            </Link>

                <div className="dropdown">
                  <button className="dropdown-trigger">
                    <span className="icon-user" aria-hidden="true"></span>
                    <span>{user.fullName}</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/my-profile" className="dropdown-item">
                      <span className="icon-user" aria-hidden="true"></span> Mon
                      Profil
                    </Link>
                    <hr className="dropdown-separator" />
                    <button onClick={handleLogout} className="dropdown-item">
                      <span className="icon-logout" aria-hidden="true"></span>{" "}
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">
                  Connexion
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-button">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <span className="icon-close" aria-hidden="true"></span>
              ) : (
                <span className="icon-menu" aria-hidden="true"></span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="mobile-menu">
            <Link
              to="/"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/events"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Événements
            </Link>
            <Link
              to="/about"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              À propos
            </Link>

            {user ? (
              <>
                {user.userType?.trim().toLowerCase() === "client" && (
                  <Link
                    to="/my-reservations"
                    className="mobile-nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes Réservations
                  </Link>
                )}
                <Link
                  to="/my-profile"
                  className="mobile-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Mon Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="mobile-nav-link logout-btn"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="mobile-nav-link btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
