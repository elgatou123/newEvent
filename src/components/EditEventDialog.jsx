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

const EditEventDialog = ({ open, onOpenChange, event, onDelete }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    type: "party",
    location: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event && open) {
      setFormValues({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "party",
        location: event.location || "",
        image: event.image || "",
      });
      setErrors({});
    }
  }, [event, open]);

  if (!open) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);

      // Simulate API call to update event
      setTimeout(() => {
        console.log("Mise à jour de l'événement:", event.id, formValues);
        alert("Votre événement a été mis à jour avec succès !");
        setIsLoading(false);
        onOpenChange(false);
      }, 1000);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
      )
    ) {
      setIsLoading(true);

      // Simulate API call to delete event
      setTimeout(() => {
        console.log("Suppression de l'événement:", event.id);
        alert("Votre événement a été supprimé avec succès !");
        setIsLoading(false);
        onOpenChange(false);
        if (typeof onDelete === "function") {
          onDelete(event.id);
        }
      }, 1000);
    }
  };

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
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
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="form-item">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${
                errors.description ? "input-error" : ""
              }`}
              placeholder="Décrivez votre événement..."
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="form-error">{errors.description}</p>
            )}
          </div>

          {/* Type */}
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

          {/* Location */}
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
            />
            {errors.location && (
              <p className="form-error">{errors.location}</p>
            )}
          </div>

          {/* Image URL */}
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

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Mise à jour..." : "Mettre à Jour l'Événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventDialog;
