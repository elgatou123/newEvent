import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Edit, Trash2, MoreVertical } from "lucide-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useToast } from "../hooks/use-toast";
import EditEventDialog from "./EditEventDialog";
import { Actions } from "../store"; // Adjust path to your store
import "./EventCard.css";

const EventCard = ({ 
  event, 
  isOwner, 
  deleteEvent, 
  editEvent ,
    servicesList = []
}) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const {
    id = '',
    title = 'No title available',
    description = 'No description available',
    location = 'Location not specified',
    type = 'other',
    image = '/default-event-image.jpg',
    available_spots = 0,
    organizer_id = null
  } = event || {};

  const handleEdit = (e) => {
    e.preventDefault();
    setShowEditDialog(true);
    setShowDropdown(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteEvent(id);
      toast({
        title: "Event Deleted",
        description: "Your event has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setShowDropdown(false);
  };

  const handleImageError = (e) => {
    e.target.src = '/default-event-image.jpg';
  };

  const displayType = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : 'Event';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="event-card" data-testid="event-card">
      <div className="event-image-wrapper">
        <img
          src={image}
          alt={title}
          className="event-image"
          onError={handleImageError}
        />
        <div className="event-type-badge">{displayType}</div>

        {isOwner && (
          <div ref={dropdownRef} className="event-menu-container">
            <div
              className="event-menu-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            >
              <MoreVertical size={20} />
            </div>

            {showDropdown && (
              <ul 
                className="dropdown-menu"
                style={{ display: 'block', opacity: 1, visibility: 'visible' }}
              >
                <li
                  className="dropdown-item"
                  onClick={handleEdit}
                >
                  <Edit className="dropdown-icon" />
                  Edit
                </li>
                <li
                  className="dropdown-item dropdown-delete"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="dropdown-icon" />
                  Delete
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <Link to={`/events/${id}`} className="event-link">
        <div className="event-content">
          <h3 className="event-title">{title}</h3>
          <p className="event-description">
            {description.length > 100
              ? `${description.substring(0, 100)}...`
              : description}
          </p>
          <div className="event-meta">
            <span>Available spots: {available_spots}</span>
          </div>
          <div className="event-meta">
            <MapPin size={16} />
            <span className="location">{location}</span>
          </div>
        </div>
      </Link>

      <div className="event-footer">Organized by {organizer_id || "Anonymous"}</div>

      {showDeleteDialog && (
        <div
          className="alert-dialog-backdrop"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="alert-dialog-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="alert-dialog-title">Are you sure?</h2>
            <p className="alert-dialog-description">
              This action will permanently delete your event.
            </p>
            <div className="alert-dialog-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

     <EditEventDialog
  open={showEditDialog}
  onOpenChange={setShowEditDialog}
  event={event}
  onSave={editEvent} // This is the Redux action
  onDelete={() => deleteEvent(event.id)}
  servicesList={servicesList} // Pass the servicesList prop

/>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.string,
    available_spots: PropTypes.number,
    organizer_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  isOwner: PropTypes.bool,
  deleteEvent: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
    servicesList: PropTypes.array, // Ajout de la propType

};

EventCard.defaultProps = {
  isOwner: false,
  servicesList: [], // Valeur par défaut
};

const mapDispatchToProps = {
  deleteEvent: Actions.deleteEvent,
  editEvent: Actions.editEvent,
};

export default connect(null, mapDispatchToProps)(EventCard);