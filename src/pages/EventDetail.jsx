import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MapPin,
  User,
  Check,
  ShoppingBasket,
  Share2,
  ChevronRight,
  Lock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReservationForm from "../components/ReservationForm";
import { toast } from "../hooks/use-toast";
import { Actions } from "../store";
import "./EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { 
    selectedEvent, 
    loading, 
    error,
    relatedEvents,
    relatedLoading 
  } = useSelector((state) => state.events);
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(Actions.getEventById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedEvent?.type) {
      dispatch(Actions.loadRelatedEvents(selectedEvent.type, id));
    }
  }, [selectedEvent?.type, id, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Échec du chargement des détails de l'événement",
        variant: "destructive",
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="loading-main">
          <div className="loading-spinner"></div>
          <p>Chargement des détails de l'événement...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="page-container error-container">
        <Navbar />
        <main className="error-main">
          <div className="error-box">
            <h1 className="error-title">Événement introuvable</h1>
            <p className="error-desc">
              L'événement que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <button
              onClick={() => navigate("/events")}
              className="btn-primary"
            >
              Voir les événements
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="page-container error-container">
        <Navbar />
        <main className="error-main">
          <div className="auth-box">
            <div className="error-icon-text">
              <Lock className="error-icon" />
              <h1 className="error-title">Connexion requise</h1>
              <p className="error-desc">
                Vous devez vous inscrire ou vous connecter pour voir les détails de l'événement et faire des réservations.
              </p>
            </div>
            <div className="error-buttons">
              <button
                onClick={() => navigate("/signup")}
                className="btn-success"
              >
                S'inscrire
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate("/events")}
                className="btn-outline"
              >
                Retour aux événements
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: selectedEvent.title,
          text: `Découvrez cet événement : ${selectedEvent.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Erreur de partage", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien de l'événement a été copié dans le presse-papiers !",
      });
    }
  };

  return (
    <div className="page-container containered">
      <Navbar />
      <main className="maine-content">
        <section className="content-left">
          <p
            alt={selectedEvent.title}
          />
          <div className="type-badge">
            {selectedEvent.type?.charAt(0).toUpperCase() + selectedEvent.type?.slice(1)}
          </div>
          <h1 className="page-title">{selectedEvent.title}</h1>
          <p className="page-description">{selectedEvent.description}</p>

          <section className="details-section">
            <header className="details-header">
              <h2 className="details-title">Détails de l'événement</h2>
              <p className="details-subtitle">Tout ce que vous devez savoir sur cet événement</p>
            </header>

            <div className="details-grid">
              <div className="detail-item">
                <MapPin className="detail-icon" />
                <div>
                  <h3 className="detail-label">Lieu</h3>
                  <p className="detail-text">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="detail-item">
                <User className="detail-icon" />
                <div>
                  <h3 className="detail-label">Organisateur</h3>
                  <p className="detail-text">{selectedEvent.organizer?.name || 'Inconnu'}</p>
                </div>
              </div>
            </div>

            <section className="features-section">
              <h3 className="section-title">Description</h3>
              <p className="page-description">{selectedEvent.description}</p>
            </section>

            <section className="features-section">
              <h3 className="section-title features-title">
                <ShoppingBasket className="feature-icon" />
                Services inclus
              </h3>
              <div className="features-list">
                {selectedEvent.services?.map((service) => (
                  <div key={service.id} className="feature-item">
                    <Check className="feature-check-icon" />
                    <div>
                      <h4 className="feature-name">{service.name}</h4>
                      <p className="feature-desc">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <footer className="section-footer">
              <button
                onClick={handleShare}
                className="btn-primary btn-icon"
              >
                <Share2 className="btn-icon-svg" />
                Partager l'événement
              </button>

              <button
                onClick={() => setIsDialogOpen(true)}
                className="btn-success"
              >
                Réserver maintenant
              </button>

              {isDialogOpen && (
                <div
                  onClick={() => setIsDialogOpen(false)}
                  className="modal-backdrop"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="modal-content"
                  >
                    <ReservationForm 
                      event={selectedEvent} 
                      onClose={() => setIsDialogOpen(false)} 
                    />
                  </div>
                </div>
              )}
            </footer>
          </section>
        </section>

        <aside className="sidebar">
          <section className="sidebar-card">
            <header className="sidebar-header">
              <h3>Actions rapides</h3>
            </header>
            <div className="action-buttons">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="btn-success"
              >
                Réserver votre place
              </button>
              <button
                onClick={handleShare}
                className="btn-primary btn-icon"
              >
                <Share2 className="btn-icon-svg" />
                Partager cet événement
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                <MapPin className="link-icon" />
                Voir sur la carte
              </a>
            </div>
          </section>

          <section className="sidebar-card">
            <header className="sidebar-header">
              <h3>Événements similaires</h3>
            </header>
            <div className="related-items-list">
              {relatedLoading ? (
                <div className="loading-spinner-small"></div>
              ) : relatedEvents && relatedEvents.length > 0 ? (
                relatedEvents.map((event) => (
                  <Link 
                    key={event.id} 
                    to={`/events/${event.id}`} 
                    className="related-event-item"
                  >

                    <div className="related-event-info">
                      <h4>{event.title}</h4>
                      <p>{event.location}</p>
                    </div>
                    <ChevronRight className="related-event-icon" />
                  </Link>
                ))
              ) : (
                <p>Aucun événement similaire disponible</p>
              )}
            </div>
          </section>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;