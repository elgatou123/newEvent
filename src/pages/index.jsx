import { Link } from "react-router-dom";
import { Calendar, Users, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./indexH.css";

const Index = () => {
  return (
    <div className="page">
      <Navbar />

      <main className="main">
        {/* Hero Section */}
        <section className="hero-gradient">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Créez des Événements Mémorables avec des Invitations Faciles
              </h1>
              <p className="hero-description">
                Simplifiez votre processus de planification d'événements. Créez
                des événements, gérez les invitations et suivez les réponses -
                tout en un seul endroit.
              </p>
              <div className="hero-buttons">
                <Link to="/events" className="button-primary">
                  Parcourir les Événements
                </Link>
                <Link to="/about" className="button-outline">
                  En Savoir Plus
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="featuress-section">
          <div className="container">
            <h2 className="features-titlee">Comment Ça Marche</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icone">
                  <Calendar className="icon" />
                </div>
                <h3 className="feature-title">Créez Votre Événement</h3>
                <p className="feature-description">
                  Configurez votre événement avec tous les détails : date, lieu
                  et services nécessaires.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Users className="icon" />
                </div>
                <h3 className="feature-title">Invitez des Invités</h3>
                <p className="feature-description">
                  Générez des liens d'invitation uniques et partagez-les avec
                  vos invités sans effort.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Clock className="icon" />
                </div>
                <h3 className="feature-title">Suivez les Réponses</h3>
                <p className="feature-description">
                  Surveillez facilement qui a confirmé, décliné ou est encore en
                  attente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types Section */}
        <section className="event-types-section">
          <div className="container">
            <h2 className="event-types-title">Parfait pour Toute Occasion</h2>
            <p className="event-types-description">
              Des rassemblements intimes aux grands événements d'entreprise,
              notre plateforme gère tout.
            </p>

            <div className="event-types-grid">
              {["Anniversaire","Conférence","Fête","Mariage"].map((type) => (
                <div key={type} className="event-type-card">
                  <h3 className="event-type-title">{type}</h3>
                  <p className="event-type-description">
                    {getEventTypeDescription(type)}
                  </p>
                  <Link to="/events" className="view-events-button">
                    Voir les Événements {type}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">
              Prêt à Planifier Votre Prochain Événement ?
            </h2>
            <p className="cta-description">
              Rejoignez des milliers d'organisateurs d'événements qui rendent
              leurs événements réussis avec EventVerse.
            </p>
            <Link to="/events" className="cta-button">
              Commencez Aujourd'hui
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Helper function
function getEventTypeDescription(type) {
  switch (type) {
    case "Mariage":
      return "Créez de belles invitations de mariage et gérez votre jour spécial.";
    case "Anniversaire":
      return "Planifiez la célébration d'anniversaire parfaite et gardez une trace de tous vos invités.";
    case "Conférence":
      return "Organisez des conférences professionnelles avec une planification détaillée et des confirmations de présence.";
    case "Fête":
      return "Organisez des fêtes incroyables et assurez-vous que tout le monde a les détails dont il a besoin.";
    default:
      return "Planifiez et organisez votre événement avec facilité.";
  }
}

export default Index;
