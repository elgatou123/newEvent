import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ReservationSuccess.css";
import { useEffect } from "react";

const ReservationSuccess = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();

  // Validate the inviteId parameter
  useEffect(() => {
    if (!inviteId || !isValidUUID(inviteId)) {
      navigate("/not-found", { replace: true });
    }
  }, [inviteId, navigate]);

  // UUID validation function
  const isValidUUID = (uuid) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const invitePath = `/invite/${inviteId}`;
  const inviteUrl = `${window.location.origin}${invitePath}`;

  // Define copyToClipboard before it's used
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      alert("Lien d'invitation copié dans le presse-papiers !");
    } catch (err) {
      console.error("Échec de la copie :", err);
      alert("Échec de la copie du lien. Veuillez réessayer.");
    }
  };

  const shareInvite = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Invitation à un Événement",
          text: "J'aimerais vous inviter à cet événement !",
          url: inviteUrl,
        });
      } else {
        await copyToClipboard();
      }
    } catch (error) {
      console.error("Erreur lors du partage :", error);
      if (error.name !== 'AbortError') {
        await copyToClipboard();
      }
    }
  };

  if (!inviteId || !isValidUUID(inviteId)) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="reservation-page">
      <Navbar />

      <main className="reservation-main">
        <div className="reservation-wrapper">
          <div className="reservation-card">
            <div className="reservation-card-header">
              <div className="success-icon">
                <i className="fa-solid fa-check check-icon"></i>
              </div>
              <h2 className="reservation-title">Réservation Réussie !</h2>
              <p className="reservation-description">
                Votre réservation d'événement a été confirmée
              </p>
            </div>

            <div className="reservation-content">
              <p className="share-text">
                Partagez ce lien d'invitation unique avec vos invités :
              </p>

              <div className="invite-box">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="invite-input"
                  aria-label="Lien d'invitation"
                />
                <button 
                  className="icon-button" 
                  onClick={copyToClipboard}
                  aria-label="Copier le lien"
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>

              <div className="info-box">
                <h3 className="info-title">Informations Importantes</h3>
                <ul className="info-list">
                  <li>
                    • Partagez ce lien avec les personnes que vous souhaitez
                    inviter à votre événement.
                  </li>
                  <li>
                    • Chaque invité peut répondre par Confirmer, Décliner ou En
                    attente.
                  </li>
                  <li>
                    • Vous pouvez suivre toutes les réponses dans votre espace
                    "Mes Réservations".
                  </li>
                  <li>
                    • Gardez ce lien en sécurité - toute personne ayant le lien
                    peut répondre.
                  </li>
                </ul>
              </div>
            </div>

            <div className="reservation-footer">
              <button 
                className="share-button" 
                onClick={shareInvite}
                aria-label="Partager l'invitation"
              >
                <i className="fa-solid fa-share-nodes"></i> Partager l'Invitation
              </button>
              <Link to="/my-reservations" className="outline-button">
                Voir Mes Réservations
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationSuccess;