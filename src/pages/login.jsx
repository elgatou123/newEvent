import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { Actions } from "../store";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../hooks/use-toast";

import "./Login.css";

// Schema validation
const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const credentials = {
        email: values.email.trim(),
        password: values.password,
      };

      // Make sure Actions.login returns a Promise that resolves with the login response
      const response = await dispatch(Actions.login(credentials.email, credentials.password));
      
      console.log("Login response:", response);

      // You might want to check if response actually contains token or user info here
      if (response && response.token) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes connecté avec succès",
        });

console.log("Navigating to /my-profile");
navigate("/my-profile");

      } else {
        throw new Error("Login failed: invalid response");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description:
          typeof error === "string"
            ? error
            : error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Connectez-vous à votre compte</h2>
          <p className="login-subtitle">
            Ou <Link to="/signup" className="login-link">créez un nouveau compte</Link>
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="exemple@email.com"
                {...form.register("email")}
              />
              <span className="form-error">{form.formState.errors.email?.message}</span>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="form-desc">
                <Link to="/forgot-password" className="forgot-link">
                  Mot de passe oublié ?
                </Link>
              </div>
              <span className="form-error">{form.formState.errors.password?.message}</span>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                "Chargement..."
              ) : (
                <>
                  <LogIn className="login-icon" /> Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
