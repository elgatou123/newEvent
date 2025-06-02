import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./UserProfile.css";

const profileFormSchema = z.object({
  name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez saisir une adresse e-mail valide"),
  phone: z.string().optional(),
  bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
});

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  useEffect(() => {
const storedAuth = localStorage.getItem("user");
if (storedAuth) {
  const parsedAuth = JSON.parse(storedAuth);
  const parsedUser = parsedAuth.user || {};

  setUser({
    name: parsedUser.name || "",
    email: parsedUser.email || "",
    role: parsedUser.role || "client",
    // Add other fields if needed
  });

  form.reset({
    name: parsedUser.name || "",
    email: parsedUser.email || "",
    phone: parsedUser.phone || "",
    bio: parsedUser.bio || "",
  });
  setIsLoading(false);
} else {
  navigate("/login");
}

  }, [navigate, form]);

  const onSubmit = useCallback(
    (values) => {
      const storedAuth = localStorage.getItem("user");
      if (!storedAuth) {
        alert("Utilisateur non connecté");
        navigate("/login");
        return;
      }

      const parsedAuth = JSON.parse(storedAuth);

      const updatedUser = {
        ...parsedAuth.user,
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        bio: values.bio || "",
      };

      // Update auth with updated user, keep token and role intact
      const updatedAuth = {
        ...parsedAuth,
        user: updatedUser,
      };

      localStorage.setItem("user", JSON.stringify(updatedAuth));
      setUser(updatedUser);
      alert("Profil mis à jour avec succès.");
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    alert("Vous êtes déconnecté.");
    navigate("/");
  }, [navigate]);

  if (isLoading) {
    return <div className="loading-container">Chargement du profil...</div>;
  }

  return (
    <div className="profile-wrapper">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h2>Mon Profil</h2>
          <p>Gérez les informations et préférences de votre compte</p>
        </div>

        <div className="profile-grid">
          {/* Profile Summary */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Votre Profil</h3>
              <span>Informations du compte et statut</span>
            </div>
            <div className="card-avatar">
              <div className="avatar">
                <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <div className="avatar-info">
                <h4>{user?.name}</h4>
                <p>{user?.email}</p>
                <p>
                  <strong>Rôle:</strong> {user?.role === "organizer" ? "Organisateur" : "Client"}
                </p>
              </div>
            </div>
            <div className="card-footer">
              <button onClick={handleLogout} className="logout-button">
                Se Déconnecter
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <div className="edit-card">
            <div className="card-header">
              <h3>Modifier le Profil</h3>
              <span>Mettre à jour vos informations personnelles</span>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form" noValidate>
              <div className="form-group">
                <label>Nom Complet</label>
                <input type="text" {...form.register("name")} />
                <p className="error">{form.formState.errors.name?.message}</p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" {...form.register("email")} disabled />
                <p className="error">{form.formState.errors.email?.message}</p>
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input type="text" {...form.register("phone")} />
                <p className="error">{form.formState.errors.phone?.message}</p>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea rows="5" {...form.register("bio")} />
                <p className="error">{form.formState.errors.bio?.message}</p>
              </div>

              <button type="submit" className="save-button">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
