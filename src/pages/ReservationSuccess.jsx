import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ReservationSuccess.css";

const ReservationSuccess = () => {
  const { inviteLink } = useParams();
  const inviteUrl = `${window.location.origin}/invite/${inviteLink}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    alert("Invite link copied to clipboard.");
  };

  const shareInvite = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Invitation à un Événement",
          text: "J'aimerais vous inviter à cet événement !",
          url: inviteUrl,
        })
        .catch((error) => console.log("Erreur lors du partage", error));
    } else {
      copyToClipboard();
    }
  };

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
                />
                <button className="icon-button" onClick={copyToClipboard}>
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
              <button className="share-button" onClick={shareInvite}>
                <i className="fa-solid fa-share-nodes"></i> Partager
                l'Invitation
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
