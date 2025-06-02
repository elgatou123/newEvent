import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationForm.css";
import { toast } from "../hooks/use-toast";
import { generateInviteLink } from "../data/mockData";

const ReservationForm = ({ event, onClose }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!fullName || !email || !preferredDate || !preferredTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const inviteLink = generateInviteLink(event.id, fullName);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès !",
      });
      navigate(`/reservation-success/${inviteLink}`);
    }, 1000);
  };

  return (
    <div className="reservation-form-card">
      <header className="reservation-card-header">
        <h2 className="reservation-title">Réserver pour {event.title}</h2>
        <p className="reservation-description">
          Veuillez remplir vos informations pour réserver votre place.
        </p>
      </header>
      <section className="reservation-card-content">
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group">
            <label htmlFor="fullName">Nom complet *</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse e-mail *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredDate">Date souhaitée *</label>
            <input
              id="preferredDate"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime">Heure souhaitée *</label>
            <input
              id="preferredTime"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialNote">Note spéciale</label>
            <textarea
              id="specialNote"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="Demandes spéciales ou exigences alimentaires..."
              rows={3}
            />
          </div>

          <footer className="form-footer">
            <button className="cancel-button" onClick={onClose} type="button">
              Annuler
            </button>
            <button
              className={`reserve-button ${isSubmitting ? "processing" : ""}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Traitement..." : "Réserver maintenant"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default ReservationForm;
