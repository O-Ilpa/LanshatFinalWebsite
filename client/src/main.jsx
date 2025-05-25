import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { FavoritesProvider } from "./FavoritesContext.jsx";
import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from "./CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

const clientId = "718770835110-efpiqrebf5b4jg0d1oeo0lrc29o7qeoj.apps.googleusercontent.com";

function FavoritesWrapper({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!user && !!token;
  return (
    <FavoritesProvider isLoggedIn={isLoggedIn} token={token}>
      {children}
    </FavoritesProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <LanguageProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <FavoritesWrapper>
            <CartProvider>
              <App />
              <Toaster position="top-center" reverseOrder={false} />
            </CartProvider>
          </FavoritesWrapper>
        </GoogleOAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  </HelmetProvider>
);
