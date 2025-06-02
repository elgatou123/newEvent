import React, { useState, useEffect } from "react";
import "./EditEventDialog.css";

const EVENT_TYPES = [
  { value: "wedding", label: "Mariage" },
  { value: "birthday", label: "Anniversaire" },
  { value: "party", label: "Fête" },
  { value: "conference", label: "Conférence" },
  { value: "meeting", label: "Réunion" },
  { value: "funeral", label: "Funérailles" },
  { value: "other", label: "Autre" },
];

const EditEventDialog = ({ 
  open, 
  onOpenChange, 
  event, 
  onSave, 
  onDelete,
  servicesList = []
}) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    type: "party",
    location: "",
    image: "",
    available_spots: 1,
    services: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event && open) {
      console.log('Initial event services:', event.services);
      console.log('Available services:', servicesList);
      
      setFormValues({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "party",
        location: event.location || "",
        image: event.image || "",
        available_spots: event.available_spots || 1,
        services: event.services 
          ? event.services.map(s => s.id || s._id || s) 
          : [],
      });
      setErrors({});
    }
  }, [event, open, servicesList]);

  const validate = () => {
    const errs = {};
    if (!formValues.title || formValues.title.length < 3) {
      errs.title = "Le titre doit contenir au moins 3 caractères";
    }
    if (!formValues.description || formValues.description.length < 10) {
      errs.description = "La description doit contenir au moins 10 caractères";
    }
    if (!formValues.location || formValues.location.length < 5) {
      errs.location = "Le lieu doit contenir au moins 5 caractères";
    }
    if (!formValues.available_spots || formValues.available_spots < 1) {
      errs.available_spots = "Doit avoir au moins 1 place disponible";
    }
    if (formValues.image && formValues.image !== "") {
      try {
        new URL(formValues.image);
      } catch {
        errs.image = "Veuillez entrer une URL d'image valide";
      }
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleServiceChange = (serviceId) => {
    setFormValues(prev => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      try {
        await onSave(event.id, formValues);
        onOpenChange(false);
      } catch (error) {
        console.error("Error saving event:", error);
        setErrors({ submit: error.message || "Une erreur est survenue lors de la mise à jour" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
    )) {
      setIsLoading(true);
      try {
        await onDelete(event.id);
        onOpenChange(false);
      } catch (error) {
        console.error("Error deleting event:", error);
        setErrors({ submit: error.message || "Une erreur est survenue lors de la suppression" });
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-content">
        <header className="dialog-header">
          <h2 id="dialog-title" className="dialog-title">
            Modifier l'Événement
          </h2>
          <p className="dialog-subtitle">
            Mettez à jour les détails de votre événement ci-dessous.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          {errors.submit && (
            <div className="form-error-message">{errors.submit}</div>
          )}

          <div className="form-item">
            <label htmlFor="title" className="form-label">
              Titre de l'Événement
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`form-input ${errors.title ? "input-error" : ""}`}
              placeholder="Entrez le titre de l'événement"
              value={formValues.title}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-item">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? "input-error" : ""}`}
              placeholder="Décrivez votre événement..."
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            {errors.description && (
              <p className="form-error">{errors.description}</p>
            )}
          </div>

          <div className="form-item">
            <label htmlFor="type" className="form-label">
              Type d'Événement
            </label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={formValues.type}
              onChange={handleChange}
              disabled={isLoading}
            >
              {EVENT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item">
            <label htmlFor="location" className="form-label">
              Lieu
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className={`form-input ${errors.location ? "input-error" : ""}`}
              placeholder="Entrez le lieu de l'événement"
              value={formValues.location}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            {errors.location && (
              <p className="form-error">{errors.location}</p>
            )}
          </div>

          <div className="form-item">
            <label htmlFor="available_spots" className="form-label">
              Nombre de places disponibles
            </label>
            <input
              id="available_spots"
              name="available_spots"
              type="number"
              min="1"
              className={`form-input ${errors.available_spots ? "input-error" : ""}`}
              placeholder="Entrez le nombre de places"
              value={formValues.available_spots}
              onChange={handleNumberChange}
              disabled={isLoading}
              required
            />
            {errors.available_spots && (
              <p className="form-error">{errors.available_spots}</p>
            )}
          </div>

          <div className="form-item">
            <label htmlFor="image" className="form-label">
              URL de l'Image (Optionnel)
            </label>
            <input
              id="image"
              name="image"
              type="url"
              className={`form-input ${errors.image ? "input-error" : ""}`}
              placeholder="https://exemple.com/image.jpg"
              value={formValues.image}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.image && <p className="form-error">{errors.image}</p>}
          </div>

          <div className="form-item">
            <label className="form-label">
              Services
            </label>
            <div className="services-checkbox-group">
              {servicesList.map(service => {
                const serviceId = service.id || service._id;
                return (
                  <div key={serviceId} className="service-checkbox">
                    <input
                      type="checkbox"
                      id={`service-${serviceId}`}
                      checked={formValues.services.includes(serviceId)}
                      onChange={() => handleServiceChange(serviceId)}
                      disabled={isLoading}
                    />
                    <label htmlFor={`service-${serviceId}`}>
                      {service.name || service.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </button>

            {onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Mise à jour..." : "Mettre à Jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventDialog;