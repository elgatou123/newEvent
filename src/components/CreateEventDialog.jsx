import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import * as z from "zod";
import "./CreateEventDialog.css";
import { useToast } from "../hooks/use-toast";
import { Actions } from "../store";

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  type: z.enum(["wedding", "birthday", "party", "conference", "meeting", "funeral", "other"]),
  location: z.string().min(5, "Le lieu doit contenir au moins 5 caractères"),
  services: z.array(z.string()).min(2, "Veuillez sélectionner au moins 2 services"),
  availableSpots: z.number().min(1, "Le nombre de places doit être d'au moins 1"),
});

const availableServices = [
  { id: "catering", label: "Restauration" },
  { id: "decoration", label: "Décoration" },
  { id: "music", label: "Musique / DJ" },
  { id: "photography", label: "Photographie" },
];

const CreateEventDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state) => state.auth);
  const { loading: eventLoading, error: eventError } = useSelector((state) => state.events);
  const { data: services } = useSelector((state) => state.services);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Get user from localStorage as fallback
  useEffect(() => {
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    if (localStorageUser?.user) {
      setCurrentUser(localStorageUser.user);
    }
  }, []);

  // Prefer Redux user if available, otherwise use localStorage user
  const user = reduxUser || currentUser;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "party",
      location: "",
      services: [],
      availableSpots: 1,
    },
  });

  useEffect(() => {
    form.setValue("services", selectedServices);
  }, [selectedServices, form]);

  useEffect(() => {
    if (eventError) {
      toast({
        title: "Erreur",
        description: eventError,
        variant: "destructive",
      });
    }
  }, [eventError, toast]);

  if (!open) return null;

  if (!user) {
    return (
      <div className="dialog-backdrop" onClick={() => onOpenChange(false)}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <p>Vous devez être connecté pour créer un événement.</p>
          <button 
            className="btn btn-primary"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const handleServiceChange = (serviceId, checked) => {
    setSelectedServices((prev) =>
      checked ? [...prev, serviceId] : prev.filter((id) => id !== serviceId)
    );
  };

  const onSubmit = async (values) => {
    try {
      if (!user || !user.id) {
        throw new Error("User authentication required to create an event");
      }

      // Map service names to IDs using the services from Redux store
      const serviceIds = selectedServices.map(serviceName => {
        const service = services?.find(s => s.name?.toLowerCase() === serviceName?.toLowerCase());
        return service ? service.id : null;
      }).filter(id => id !== null);

      // Prepare payload for backend
      const payload = {
        title: values.title,
        description: values.description,
        type: values.type,
        location: values.location,
        available_spots: values.availableSpots,
        organizer_id: user.id,
        services: serviceIds
      };

      console.log("Submitting event with payload:", payload);

      // Dispatch the action and wait for the result
      const result = await dispatch(Actions.createEvent(payload));
      
      // Check if the action was successful
      if (result.error) {
        throw new Error(result.error.message || "Failed to create event");
      }

      toast({
        title: "Événement créé",
        description: "Votre événement a été créé avec succès !",
      });
      form.reset();
      setSelectedServices([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de l'événement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="dialog-backdrop" onClick={() => onOpenChange(false)}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <header className="dialog-header">
          <h2 className="dialog-title">Créer un nouvel événement</h2>
          <p className="dialog-description">
            Remplissez les détails ci-dessous pour créer votre événement.
          </p>
        </header>

        <form onSubmit={form.handleSubmit(onSubmit)} className="form">
          <fieldset disabled={eventLoading}>
            {/* Title */}
            <div className="form-item">
              <label className="form-label" htmlFor="title">Titre</label>
              <input
                id="title"
                className="form-input"
                placeholder="Entrez le titre"
                {...form.register("title")}
              />
              <p className="form-message">{form.formState.errors.title?.message}</p>
            </div>

            {/* Description */}
            <div className="form-item">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-textarea"
                rows="5"
                placeholder="Décrivez l'événement"
                {...form.register("description")}
              />
              <p className="form-message">{form.formState.errors.description?.message}</p>
            </div>

            {/* Type */}
            <div className="form-item">
              <label className="form-label" htmlFor="type">Type</label>
              <select
                id="type"
                className="form-select"
                {...form.register("type")}
              >
                <option value="wedding">Mariage</option>
                <option value="birthday">Anniversaire</option>
                <option value="party">Fête</option>
                <option value="conference">Conférence</option>
                <option value="meeting">Réunion</option>
                <option value="funeral">Funérailles</option>
                <option value="other">Autre</option>
              </select>
              <p className="form-message">{form.formState.errors.type?.message}</p>
            </div>

            {/* Location */}
            <div className="form-item">
              <label className="form-label" htmlFor="location">Lieu</label>
              <input
                id="location"
                className="form-input"
                placeholder="Lieu de l'événement"
                {...form.register("location")}
              />
              <p className="form-message">{form.formState.errors.location?.message}</p>
            </div>

            {/* Services */}
            <div className="form-item">
              <label className="form-label">Services</label>
              <div className="form-checkbox-group">
                {availableServices.map((service) => (
                  <div key={service.id} className="form-checkbox-item">
                    <input
                      type="checkbox"
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                    />
                    <label htmlFor={service.id} className="form-checkbox-label">
                      {service.label}
                    </label>
                  </div>
                ))}
              </div>
              <p className="form-message">{form.formState.errors.services?.message}</p>
            </div>

            {/* Available Spots */}
            <div className="form-item">
              <label className="form-label" htmlFor="availableSpots">Places disponibles</label>
              <input
                id="availableSpots"
                type="number"
                className="form-input"
                min="1"
                placeholder="Nombre d'invités"
                {...form.register("availableSpots", {
                  setValueAs: (v) => parseInt(v) || 1,
                })}
              />
              <p className="form-message">{form.formState.errors.availableSpots?.message}</p>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onOpenChange(false)}
                disabled={eventLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={eventLoading}
              >
                {eventLoading ? "Création..." : "Créer l'événement"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CreateEventDialog;