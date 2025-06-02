import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserPlus, Eye, EyeOff } from "lucide-react";

import { useToast } from "../hooks/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Signup.css";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir une adresse e-mail valide"),
    password: z.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
    userType: z.enum(["client", "organizer"], {
      required_error: "Veuillez sélectionner votre type d'utilisateur",
    }),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "Vous devez accepter les conditions générales",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "client",
      acceptTerms: false,
    },
  });

  const onSubmit = (values) => {
    console.log("Tentative d'inscription:", values);

    localStorage.setItem("user", JSON.stringify({
      email: values.email,
      fullName: values.fullName,
      userType: values.userType,
      isLoggedIn: true,
    }));

    toast({
      title: "Compte créé avec succès",
      description: `Bienvenue sur EventVerse en tant qu'${values.userType === 'organizer' ? 'organisateur' : 'utilisateur'} !`,
    });

    navigate("/events");
  };

  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-container">
        <div className="signup-box">
          <div>
            <h2 className="signup-title">Créer votre compte</h2>
            <p className="signup-subtitle">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="link">
                Se connecter
              </Link>
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="signup-form" noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Nom Complet</label>
              <input
                id="fullName"
                type="text"
                placeholder="Jean Dupont"
                {...form.register("fullName")}
                className={form.formState.errors.fullName ? "input-error" : ""}
              />
              {form.formState.errors.fullName && (
                <p className="error">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                {...form.register("email")}
                className={form.formState.errors.email ? "input-error" : ""}
              />
              {form.formState.errors.email && (
                <p className="error">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* User Type */}
            <div className="form-group">
              <label>Sélectionnez votre rôle :</label>

              <div className="checkbox-group">
                <input
                  type="radio"
                  id="organizer"
                  value="organizer"
                  {...form.register("userType")}
                  defaultChecked={form.getValues("userType") === "organizer"}
                />
                <label htmlFor="organizer">
                  <strong>Organisateur</strong>
                  <br />
                  Je veux créer et gérer des événements
                </label>
              </div>

              <div className="checkbox-group">
                <input
                  type="radio"
                  id="client"
                  value="client"
                  {...form.register("userType")}
                  defaultChecked={form.getValues("userType") === "client"}
                />
                <label htmlFor="client">
                  <strong>Client (Utilisateur normal)</strong>
                  <br />
                  Je veux participer et découvrir des événements
                </label>
              </div>
              {form.formState.errors.userType && (
                <p className="error">{form.formState.errors.userType.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group password-field">
              <label htmlFor="password">Mot de Passe</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                  className={form.formState.errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="error">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group password-field">
              <label htmlFor="confirmPassword">Confirmer le Mot de Passe</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("confirmPassword")}
                  className={form.formState.errors.confirmPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="error">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Accept Terms */}
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="acceptTerms"
                {...form.register("acceptTerms")}
              />
              <label htmlFor="acceptTerms" className="terms-label">
                J'accepte les{" "}
                <Link to="/terms" className="link">
                  conditions générales
                </Link>
              </label>
              {form.formState.errors.acceptTerms && (
                <p className="error">{form.formState.errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              <UserPlus className="icon" />
              Créer le Compte
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
