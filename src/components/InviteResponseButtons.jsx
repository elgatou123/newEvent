import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import "./InviteResponseButtons.css";

const InviteResponseButtons = () => {
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (selectedResponse) => {
    if (response === selectedResponse) return;
    
    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setResponse(selectedResponse);
      setIsSubmitting(false);
      
      // Show different alerts based on response
      switch(selectedResponse) {
        case "confirmed":
          alert("Vous avez confirmé votre participation!");
          break;
        case "declined":
          alert("Vous avez décliné l'invitation");
          break;
        case "pending":
          alert("Vous avez mis en attente");
          break;
      }
    }, 800);
  };

  return (
    <div className="invite-response-container">
      <h3>Répondre à l'invitation</h3>
      
      <div className="response-options">
        <button
          className={`response-btn confirm-btn ${response === "confirmed" ? "active" : ""}`}
          onClick={() => handleResponse("confirmed")}
          disabled={isSubmitting}
        >
          <Check size={18} />
          <span>Accepter</span>
          {isSubmitting && response === "confirmed" && <span className="loading"></span>}
        </button>
        
        <button
          className={`response-btn decline-btn ${response === "declined" ? "active" : ""}`}
          onClick={() => handleResponse("declined")}
          disabled={isSubmitting}
        >
          <X size={18} />
          <span>Refuser</span>
          {isSubmitting && response === "declined" && <span className="loading"></span>}
        </button>
        
        <button
          className={`response-btn maybe-btn ${response === "pending" ? "active" : ""}`}
          onClick={() => handleResponse("pending")}
          disabled={isSubmitting}
        >
          <Clock size={18} />
          <span>Peut-être</span>
          {isSubmitting && response === "pending" && <span className="loading"></span>}
        </button>
      </div>
      
      {response && (
        <div className="response-status">
          Statut actuel: <span className={`status ${response}`}>
            {response === "confirmed" && "Confirmé"}
            {response === "declined" && "Décliné"}
            {response === "pending" && "En attente"}
          </span>
        </div>
      )}
    </div>
  );
};

export default InviteResponseButtons;