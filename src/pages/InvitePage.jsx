import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InviteResponseButtons from "../components/InviteResponseButtons";
import { getInvitationByLink, getEventById } from "../data/mockData";
import { formatDate, formatTime } from "../lib/utils";
import "./InvitePage.css";

const InvitePage = () => {
  const { inviteLink } = useParams();
  const invitation = getInvitationByLink(inviteLink || "");
  const event = invitation ? getEventById(invitation.eventId) : undefined;

  if (!invitation || !event) {
    return (
      <div className="invitepage">
        <Navbar />
        <main className="invitepage-main">
          <div className="invitepage-invalid">
            <h1>Invalid Invitation</h1>
            <p>This invitation link is invalid or has expired.</p>
            <a href="/events" className="invitepage-browse-btn">
              Browse Events
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="invitepage">
      <Navbar />
      <main className="invitepage-main">
        <div className="invitepage-card">
          <div className="invitepage-card-header">
            <div className="invitepage-invite-text">You've been invited to</div>
            <h2 className="invitepage-title">{event.title}</h2>
            <p className="invitepage-description">{event.description}</p>
          </div>

          <div className="invitepage-card-content">
            <div className="invitepage-info-grid">
              <div className="invitepage-info-item">
                <Calendar className="invitepage-icon" />
                <div>
                  <h3>Date</h3>
                  <p>{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="invitepage-info-item">
                <Clock className="invitepage-icon" />
                <div>
                  <h3>Time</h3>
                  <p>{formatTime(event.time)}</p>
                </div>
              </div>

              <div className="invitepage-info-item">
                <MapPin className="invitepage-icon" />
                <div>
                  <h3>Location</h3>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className="invitepage-info-item">
                <User className="invitepage-icon" />
                <div>
                  <h3>Organized by</h3>
                  <p>{event.organizerName}</p>
                </div>
              </div>
            </div>

            <div className="invitepage-response">
              <h3>Will you attend this event?</h3>
              <p>Please let {event.organizerName} know if you can make it</p>
              <InviteResponseButtons
                inviteId={invitation.id}
                initialStatus={invitation.status}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvitePage;
