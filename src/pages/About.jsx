import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Bell,
  CheckCircle,
  Shield,
  MessageSquare,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import "./About.css";


const features = [
  {
    icon: <Calendar className="icon" />,
    title: "Création Facile d'Événements",
    description: "Créez de belles pages d'événements avec tous les détails dont vos invités ont besoin."
  },
  {
    icon: <Users className="icon" />,
    title: "Gestion des Invités",
    description: "Invitez vos invités avec des liens uniques et suivez leurs réponses."
  },
  {
    icon: <CheckCircle className="icon" />,
    title: "Suivi des Réponses",
    description: "Voyez qui a confirmé, décliné ou est encore en attente avec des mises à jour en temps réel."
  },
  {
    icon: <Bell className="icon" />,
    title: "Rappels Automatiques",
    description: "Rappels pour les événements à venir et les réponses en attente."
  },
  {
    icon: <Shield className="icon" />,
    title: "Confidentialité et Sécurité",
    description: "Vos données d'événements et informations d'invités sont toujours sécurisées."
  },
  {
    icon: <MessageSquare className="icon" />,
    title: "Communication Facile",
    description: "Communiquez facilement avec tous vos invités via la plateforme."
  }
];

const steps = [
  {
    step: "1",
    title: "Créer un Événement",
    description: "Configurez votre événement avec tous les détails : date, heure, lieu et services."
  },
  {
    step: "2",
    title: "Générer des Invitations",
    description: "Créez une réservation et obtenez un lien d'invitation unique à partager avec vos invités."
  },
  {
    step: "3",
    title: "Partager avec les Invités",
    description: "Envoyez le lien d'invitation par e-mail, messagerie ou réseaux sociaux."
  },
  {
    step: "4",
    title: "Suivre les Réponses",
    description: "Surveillez qui vient, qui ne vient pas et qui n'a pas encore répondu."
  }
];

const faqs = [
  {
    question: "EventVerse est-il gratuit ?",
    answer: "Oui, EventVerse est actuellement gratuit pour une utilisation de base. Nous pourrions ajouter des fonctionnalités premium à l'avenir."
  },
  {
    question: "Combien d'invités puis-je inviter ?",
    answer: "Il n'y a pas de limite au nombre d'invités que vous pouvez inviter."
  },
  {
    question: "Les invités peuvent-ils voir la liste complète des invités ?",
    answer: "Non, les invités ne voient que leur propre invitation et statut, pas la liste complète."
  },
  {
    question: "Puis-je modifier un événement après sa création ?",
    answer: "Oui, vous pouvez modifier les détails de votre événement à tout moment, et les invités verront les mises à jour."
  },
  {
    question: "Comment contacter le support ?",
    answer: "Pour toute question, envoyez-nous un e-mail à support@eventverse.com."
  }
];

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-main">
        <section className="hero-section">
          <div className="container">
            <div className="hero-text">
              <h1>À propos d'EventVerse Invitations</h1>
              <p>Rendre la planification d'événements et les invitations simples, élégantes et sans stress.</p>
              <Link to="/events" className="btn primary-btn">Explorer les Événements</Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container center-text">
            <h2>Notre Mission</h2>
            <p>
              Chez EventVerse, nous pensons que planifier un événement doit être aussi agréable que d’y assister. 
              Notre mission est de simplifier la planification en fournissant une plateforme fluide pour 
              créer des événements, envoyer des invitations et suivre les réponses.
            </p>
            <p>
              Que ce soit un mariage, un anniversaire, une conférence ou toute occasion spéciale, 
              nous sommes là pour rendre votre expérience de planification sans stress et agréable.
            </p>
          </div>
        </section>

        <section className="section gray-bg">
          <div className="container">
            <h2 className="text-center">Fonctionnalités Clés</h2>
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="icon-wrapper">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="text-center">Comment ça marche</h2>
            <div className="steps">
              {steps.map((s, i) => (
                <div key={i} className={`step ${i % 2 === 1 ? 'reverse' : ''}`}>
                  <div className="step-number">{s.step}</div>
                  <div className="step-text">
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    {i === 0 && (
                      <Link to="/events" className="btn primary-btn">Parcourir les Événements</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section gray-bg">
          <div className="container">
            <h2 className="text-center">Questions Fréquentes</h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className="faq-card">
                  <div className="faq-icon"><HelpCircle className="icon" /></div>
                  <div>
                    <h3>{f.question}</h3>
                    <p>{f.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container text-center white-text">
            <h2>Prêt à Planifier Votre Événement ?</h2>
            <p>Commencez dès aujourd'hui et faites de votre prochain événement un succès mémorable.</p>
            <Link to="/events" className="btn white-btn">
              Commencer
              <ChevronRight className="icon-right" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
