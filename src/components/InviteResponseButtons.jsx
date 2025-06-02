import { useState } from "react";
import "./InviteResponseButtons.css";
import { toast } from "../hooks/use-toast";
import { Check, X, Clock } from "lucide-react";

const InviteResponseButtons = ({ inviteId, initialStatus }) => {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateResponse = (newStatus) => {
    if (status === newStatus) return;
    
    setIsUpdating(true);
    
    // Simulate API call to update response
    setTimeout(() => {
      setStatus(newStatus);
      setIsUpdating(false);
      
      toast({
        title: "Response Updated",
        description: `Your response has been updated to ${newStatus}.`,
      });
    }, 500);
  };

  return (
    <div className="response-buttons-container">
      <button
        className={`response-button ${status === "confirmed" ? "confirmed" : "default"}`}
        onClick={() => updateResponse("confirmed")}
        disabled={isUpdating}
      >
        <Check className="icon" />
        Confirm
      </button>
      
      <button
        className={`response-button ${status === "declined" ? "declined" : "default"}`}
        onClick={() => updateResponse("declined")}
        disabled={isUpdating}
      >
        <X className="icon" />
        Decline
      </button>
      
      <button
        className={`response-button ${status === "pending" ? "pending" : "default"}`}
        onClick={() => updateResponse("pending")}
        disabled={isUpdating}
      >
        <Clock className="icon" />
        Pending
      </button>
    </div>
  );
};

export default InviteResponseButtons;
