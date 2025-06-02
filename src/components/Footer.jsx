import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">Event-Verse</h3>
            <p className="footer-description">
              Making event planning and invitations simple and elegant.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/events" className="footer-link">Events</Link></li>
              <li><Link to="/my-reservations" className="footer-link">My Reservations</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Event Types</h4>
            <ul className="footer-links">
              <li><Link to="/events" className="footer-link">Weddings</Link></li>
              <li><Link to="/events" className="footer-link">Parties</Link></li>
              <li><Link to="/events" className="footer-link">Conferences</Link></li>
              <li><Link to="/events" className="footer-link">Birthdays</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <p className="footer-description">
              Questions or feedback?<br />
              Email us at: <a href="mailto:info@event-verse.com" className="footer-email">info@event-verse.com</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">&copy; {currentYear} Event-Verse. All rights reserved.</p>
          <div className="footer-links-bottom">
            <a href="#" className="footer-link-bottom">Privacy Policy</a>
            <a href="#" className="footer-link-bottom">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
