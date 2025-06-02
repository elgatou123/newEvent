import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  User,
  Link as LinkIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatDate, formatTime, getStatusColor } from "../lib/utils";
import { toast } from "../hooks/use-toast";
import { Actions } from "../store";
import "./MyReservations.css";

const MyReservations = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("organized");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const reservations = useSelector((state) => state.reservations.list || []);
  const invitations = useSelector((state) => state.reservations.invitations || []);
  console.log("Reservations from Redux:", reservations);
  console.log("Invitations from Redux:", invitations);


useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!user) return;

      console.log("Fetching data for tab:", activeTab);

      if (activeTab === "organized") {
        console.log("Dispatching loadReservations");
        await dispatch(Actions.loadReservations());
      } else {
        console.log("Dispatching loadInvitations");
        await dispatch(Actions.loadInvitations());
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchData();

  return () => {
    cancelled = true;
  };
}, [user?.id, activeTab]);
 // avoid [userId] alone — include all real dependencies


  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
  };

  if (!user) {
    return (
      <div className="my-reservations-container">
        <Navbar />
        <main className="main-content">
          <div className="empty-message">
            <h3>Connectez-vous pour voir vos réservations</h3>
            <p>Vous devez être connecté pour accéder à cette page.</p>
            <a href="/login" className="button primary-button">
              Se connecter
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-reservations-container">
        <Navbar />
        <main className="main-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement de vos réservations...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-reservations-container">
      <Navbar />
      <main className="main-content">
        <h1 className="title">Mes Réservations</h1>
        <div className="tabs">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === "organized" ? "active" : ""}`}
              onClick={() => setActiveTab("organized")}
            >
              Événements que j'ai organisés
            </button>
            <button
              className={`tab-button ${activeTab === "invitations" ? "active" : ""}`}
              onClick={() => setActiveTab("invitations")}
            >
              Mes Invitations
            </button>
          </div>

          {activeTab === "organized" && (
            <div className="tab-content">
              {reservations.length > 0 ? (
                reservations.map((reservation) => {
                  const confirmed = reservation.guests?.filter((g) => g.status === "confirmed").length || 0;
                  const declined = reservation.guests?.filter((g) => g.status === "declined").length || 0;
                  const pending = reservation.guests?.filter((g) => g.status === "pending").length || 0;

                  return (
                    <div className="card" key={reservation.id}>
                      <div className="card-header">
                        <div className="card-header-left">
                          <span className="event-type">{reservation.event?.type}</span>
                          <h2 className="event-title">{reservation.event?.title}</h2>
                          <p className="event-description">
                            Réservé le {formatDate(reservation.created_at)}
                          </p>
                        </div>
                        <div className="card-header-right">
                          <a className="button outline-button" href={`/events/${reservation.event?.id}`}>
                            Voir l'événement
                          </a>
                          <button
                            className="button outline-button"
                            onClick={() => copyToClipboard(`${window.location.origin}/invite/${reservation.invite_id}`)}
                          >
                            <LinkIcon className="icon" />
                            Copier le lien d'invitation
                          </button>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="info-grid">
                          <div className="info-item">
                            <Calendar className="icon primary" />
                            <div>
                              <h4>Date</h4>
                              <p>{formatDate(reservation.event?.date)}</p>
                            </div>
                          </div>
                          <div className="info-item">
                            <Clock className="icon primary" />
                            <div>
                              <h4>Heure</h4>
                              <p>{formatTime(reservation.event?.time)}</p>
                            </div>
                          </div>
                          <div className="info-item">
                            <MapPin className="icon primary" />
                            <div>
                              <h4>Lieu</h4>
                              <p className="truncate">{reservation.event?.location}</p>
                            </div>
                          </div>
                          <div className="info-item">
                            <User className="icon primary" />
                            <div>
                              <h4>Invités</h4>
                              <p>{reservation.guests?.length || 0} invités</p>
                            </div>
                          </div>
                        </div>

                        <div className="guest-responses">
                          <h3>Réponses des invités</h3>
                          <div className="responses-grid">
                            <div className="response-box confirmed">
                              <CheckCircle className="icon response-icon" />
                              <span>Confirmés</span>
                              <span className="badge">{confirmed}</span>
                            </div>
                            <div className="response-box declined">
                              <XCircle className="icon response-icon" />
                              <span>Déclinés</span>
                              <span className="badge">{declined}</span>
                            </div>
                            <div className="response-box pending">
                              <ClockIcon className="icon response-icon" />
                              <span>En attente</span>
                              <span className="badge">{pending}</span>
                            </div>
                          </div>
                        </div>

                        {reservation.guests?.length > 0 && (
                          <div className="guest-list">
                            <h3>Liste des invités</h3>
                            <table className="guest-table">
                              <thead>
                                <tr>
                                  <th>Nom</th>
                                  <th>Email</th>
                                  <th>Statut</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {reservation.guests.map((guest) => (
                                  <tr key={guest.id}>
                                    <td>{guest.guest_name}</td>
                                    <td>{guest.guest_email}</td>
                                    <td>
                                      <span className={`badge ${getStatusColor(guest.status)}`}>
                                        {guest.status}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="icon-button"
                                        onClick={() =>
                                          copyToClipboard(`${window.location.origin}/invite/${guest.invite_id}`)
                                        }
                                      >
                                        <Share2 className="icon" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-message">
                  <h3>Aucun événement organisé</h3>
                  <p>Vous n'avez encore organisé aucun événement.</p>
                  <a href="/events" className="button primary-button">
                    Parcourir les événements
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === "invitations" && (
            <div className="tab-content invitations">
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
                  <div className="card" key={invitation.id}>
                    <div className="image-section">
                      <img src={invitation.event?.image} alt={invitation.event?.title} className="event-image" />
                      <span className={`badge status-badge ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </div>

                    <div className="card-header">
                      <h2 className="event-title">{invitation.event?.title}</h2>
                      <p className="event-description">Invité par {invitation.event?.organizer_name}</p>
                    </div>

                    <div className="card-body">
                      <div className="info-item">
                        <Calendar className="icon" />
                        <span>{formatDate(invitation.event?.date)}</span>
                      </div>
                      <div className="info-item">
                        <Clock className="icon" />
                        <span>{formatTime(invitation.event?.time)}</span>
                      </div>
                      <div className="info-item">
                        <MapPin className="icon" />
                        <span className="truncate">{invitation.event?.location}</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <a href={`/events/${invitation.event?.id}`} className="button outline-button">
                        Voir les détails
                      </a>
                      <a
                        href={`/invite/${invitation.invite_id}`}
                        className="button primary-button"
                      >
                        {invitation.status === "pending" ? "Répondre" : "Voir invitation"}
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-message">
                  <h3>Aucune invitation</h3>
                  <p>Vous n'avez été invité à aucun événement pour le moment.</p>
                  <a href="/events" className="button primary-button">
                    Parcourir les événements
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReservations;
