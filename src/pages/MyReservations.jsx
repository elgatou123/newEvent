import { useState } from "react";
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
import { mockReservations, mockEvents, mockInvitations } from "../data/mockData";
import { formatDate, formatTime, getStatusColor } from "../lib/utils";
import { toast } from "../hooks/use-toast";
import "./MyReservations.css";

const MyReservations = () => {
  const [activeTab, setActiveTab] = useState("organized");

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
  };

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
              {mockReservations.length > 0 ? (
                mockReservations.map((reservation) => {
                  const event = mockEvents.find((e) => e.id === reservation.eventId);
                  if (!event) return null;

                  const confirmed = reservation.guests.filter((g) => g.status === "confirmed").length;
                  const declined = reservation.guests.filter((g) => g.status === "declined").length;
                  const pending = reservation.guests.filter((g) => g.status === "pending").length;

                  return (
                    <div className="card" key={reservation.id}>
                      <div className="card-header">
                        <div className="card-header-left">
                          <span className="event-type">{event.type}</span>
                          <h2 className="event-title">{event.title}</h2>
                          <p className="event-description">
                            Réservé par {reservation.name} ({reservation.email})
                          </p>
                        </div>
                        <div className="card-header-right">
                          <a className="button outline-button" href={`/events/${event.id}`}>
                            Voir l'événement
                          </a>
                          <button
                            className="button outline-button"
                            onClick={() => copyToClipboard(`${window.location.origin}/invite/${reservation.inviteLink}`)}
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
                              <p>{formatDate(event.date)}</p>
                            </div>
                          </div>

                          <div className="info-item">
                            <Clock className="icon primary" />
                            <div>
                              <h4>Heure</h4>
                              <p>{formatTime(event.time)}</p>
                            </div>
                          </div>

                          <div className="info-item">
                            <MapPin className="icon primary" />
                            <div>
                              <h4>Lieu</h4>
                              <p className="truncate">{event.location}</p>
                            </div>
                          </div>

                          <div className="info-item">
                            <User className="icon primary" />
                            <div>
                              <h4>Invités</h4>
                              <p>{reservation.guests.length} invités</p>
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

                        {reservation.guests.length > 0 && (
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
                                    <td>{guest.guestName}</td>
                                    <td>{guest.guestEmail}</td>
                                    <td>
                                      <span className={`badge ${getStatusColor(guest.status)}`}>
                                        {guest.status}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="icon-button"
                                        onClick={() =>
                                          copyToClipboard(`${window.location.origin}/invite/${guest.inviteLink}`)
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
              {mockInvitations.length > 0 ? (
                mockInvitations.map((invitation) => {
                  const event = mockEvents.find((e) => e.id === invitation.eventId);
                  if (!event) return null;

                  return (
                    <div className="card" key={invitation.id}>
                      <div className="image-section">
                        <img src={event.image} alt={event.title} className="event-image" />
                        <span className={`badge status-badge ${getStatusColor(invitation.status)}`}>
                          {invitation.status}
                        </span>
                      </div>

                      <div className="card-header">
                        <h2 className="event-title">{event.title}</h2>
                        <p className="event-description">Invité par {event.organizerName}</p>
                      </div>

                      <div className="card-body">
                        <div className="info-item">
                          <Calendar className="icon" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="info-item">
                          <Clock className="icon" />
                          <span>{formatTime(event.time)}</span>
                        </div>
                        <div className="info-item">
                          <MapPin className="icon" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <a href={`/events/${event.id}`} className="button outline-button">
                          Voir les détails
                        </a>
                        <a
                          href={`/invite/${invitation.inviteLink}`}
                          className="button primary-button"
                        >
                          Répondre
                        </a>
                      </div>
                    </div>
                  );
                })
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
