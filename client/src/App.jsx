import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./components/home";
import LogIn from "./components/login";
import ShowMachine from "./components/ShowMachine";
import AboutUs from "./components/aboutUs";
import ProductsAndServices from "./ProductsAndServices";
import SignUp from "./components/signup";
import Password from "./components/password";
import Verify from "./components/verify";
import EgyptMaterials from "./components/EgyptMaterials";
import EgyptMaterialView from "./components/EgyptMaterialView";
import Contact from "./components/contact";
import FavoritesPage from "./components/FavoritesPage";
import Dashboard from "./components/Dashboard";
import CartPage from "./components/CartPage";
import QuoteRequestForm from "./components/QuoteRequestForm";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import GerbPartnership from "./components/GerbPartnership";

const AdminDashboard = lazy(() => import("./components/adminDashboard.jsx"));

function App() {
  return (
    <AuthProvider>
      <RecentlyViewedProvider>
        <BrowserRouter>
          <WhatsAppFloatingButton />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/password" element={<Password />} />
            <Route path="/verify" element={<Verify />} />
            <Route
              path="/admin/home"
              element={
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-screen bg-[#ccc]">
                      <div className="loader w-12 h-12 border-t-transparent"></div>
                    </div>
                  }
                >
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route path="/machine/:id" element={<ShowMachine />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/products" element={<ProductsAndServices />} />
            <Route path="/egypt-materials" element={<EgyptMaterials />} />
            <Route path="/egypt-materials/:id" element={<EgyptMaterialView />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/quote-request" element={<QuoteRequestForm />} />
            <Route path="/viewmachine/:id" element={<ShowMachine />} />
            <Route path="/viewmachine/:slug" element={<ShowMachine />} />
            <Route path="/gerb-partnership" element={<GerbPartnership />} />
            <Route
              path="*"
              element={
                <div className="text-center py-20 text-2xl">
                  404 - الصفحة غير موجودة
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </RecentlyViewedProvider>
    </AuthProvider>
  );
}

export default App;
