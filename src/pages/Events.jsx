import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import CreateEventDialog from "../components/CreateEventDialog";
import { Search, Plus } from "lucide-react";
import { Actions } from "../store";
import "./Events.css";

const Events = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const events = useSelector((state) => state.events?.data || []);
  const { user: reduxUser } = useSelector((state) => state.auth);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    dispatch(Actions.getEvents());
  }, [dispatch]);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setLocalUser(JSON.parse(userData).user);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const user = reduxUser || localUser;

  const getFilteredEvents = () => {
    let filtered = [...events];

    if (user?.role === "organizer") {
      filtered = filtered.filter(event => 
        event?.organizer_id === user?.id
      );
    }

    return filtered.filter(event => {
      if (!event) return false;

      const matchesSearch = 
        (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         event.location?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = 
        eventType === "all" || 
        event.type?.toLowerCase() === eventType.toLowerCase();

      return matchesSearch && matchesType;
    });
  };

  const filteredEvents = getFilteredEvents().map(event => ({
    id: event.id || '',
    title: event.title || 'No title available',
    description: event.description || '',
    location: event.location || '',
    type: event.type || 'other',
    image: event.image || '/default-event-image.jpg',
    available_spots: event.available_spots || 0,
    organizer_id: event.organizer_id || null,
    services: event.services || []
  }));

  const getPageTitle = () => 
    user?.role === "organizer" ? "My Events" : "Browse Events";

  const getPageDescription = () =>
    user?.role === "organizer"
      ? "Manage your events and track reservations."
      : "Find the perfect event to attend or get inspired to plan your own.";

  const emptyState = {
    title: user?.role === "organizer" 
      ? "You don't have any events" 
      : "No events found",
    description: user?.role === "organizer"
      ? "Create your first event to get started."
      : "Try adjusting your search criteria.",
    action: user?.role === "organizer" ? "Create Event" : null
  };

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <section className="intro-section">
          <div className="container">
            <h1 className="heading">{getPageTitle()}</h1>
            <p className="description">{getPageDescription()}</p>
            
            {user?.role === "organizer" && (
              <button
                className="create-button"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="icon" />
                Create Event
              </button>
            )}
          </div>
        </section>

        <section className="filter-section">
          <div className="container">
            <div className="filter-box">
              <div className="filter-grid">
                <div className="form-group">
                  <label htmlFor="search" className="form-label">
                    Search
                  </label>
                  <div className="input-wrapper">
                    <Search className="search-icon" />
                    <input
                      id="search"
                      type="text"
                      placeholder="Search..."
                      className="search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Event Type
                  </label>
                  <select
                    id="type"
                    className="select-input"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="wedding">Wedding</option>
                    <option value="party">Party</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>

                <div className="form-group button-wrapper">
                  <button
                    className="reset-button"
                    onClick={() => {
                      setSearchTerm("");
                      setEventType("all");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id || `event-${Math.random().toString(36).substr(2, 9)}`}
                    event={event}
                    isOwner={user?.role === "organizer" && user.id === event.organizer_id}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>{emptyState.title}</h3>
                <p>{emptyState.description}</p>
                {emptyState.action && (
                  <button
                    className="create-button"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="icon" />
                    {emptyState.action}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {user?.role === "organizer" && (
        <CreateEventDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      )}

      <Footer />
    </div>
  );
};

export default Events;