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
              Simplifier et embellir la planification d'événements et les invitations.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Liens rapides</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Accueil</Link></li>
              <li><Link to="/events" className="footer-link">Événements</Link></li>
              <li><Link to="/my-reservations" className="footer-link">Mes Réservations</Link></li>
              <li><Link to="/about" className="footer-link">À propos</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Types d'événements</h4>
            <ul className="footer-links">
              <li><Link to="/events" className="footer-link">Mariages</Link></li>
              <li><Link to="/events" className="footer-link">Fêtes</Link></li>
              <li><Link to="/events" className="footer-link">Conférences</Link></li>
              <li><Link to="/events" className="footer-link">Anniversaires</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <p className="footer-description">
              Questions ou commentaires ?<br />
              Envoyez-nous un email à : <a href="mailto:info@event-verse.com" className="footer-email">info@event-verse.com</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">&copy; {currentYear} Event-Verse. Tous droits réservés.</p>
          <div className="footer-links-bottom">
            <a href="#" className="footer-link-bottom">Politique de confidentialité</a>
            <a href="#" className="footer-link-bottom">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
