import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaMicrosoft, FaUser } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
const bgImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const LogIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerInput, setCustomerInput] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const API = import.meta.env.VITE_API_URL || '/api';
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded?.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/");
      }
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: customerInput,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        login({ name: decoded.name, role: decoded.role, id: decoded.id }, res.data.token);
        const redirectTo = location.state?.from || (decoded.role === "admin" ? "/admin/home" : "/dashboard");
        navigate(redirectTo, { replace: true });
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage("حدث خطأ أثناء تسجيل الدخول.");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center'}} dir="rtl">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl p-4">
        {/* Login Card */}
        <div className="bg-white/95 rounded-xl shadow p-6 flex-1 min-w-[340px] max-w-md" style={{backdropFilter: 'blur(2px)'}}>
          <h2 className="text-3xl font-bold mb-6 text-center">تسجيل الدخول</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">رقم العميل أو البريد الإلكتروني</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={customerInput}
                onChange={e => setCustomerInput(e.target.value)}
                required
                autoComplete="username"
                placeholder="أدخل رقم العميل أو البريد الإلكتروني"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">كلمة المرور</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={stayLoggedIn}
                onChange={e => setStayLoggedIn(e.target.checked)}
                className="ml-2"
                id="stayLoggedIn"
              />
              <label htmlFor="stayLoggedIn" className="text-sm">تذكرني</label>
            </div>
            {message && <div className="text-red-700 text-center mb-2">{message}</div>}
            <button
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-bold flex items-center justify-center gap-2 text-lg"
              type="submit"
              disabled={loading}
            >
              <FaUser /> {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
          <div className="mt-2 text-center">
            <a href="#" className="text-blue-600 hover:underline text-sm">نسيت رقم العميل أو كلمة المرور؟</a>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">أو تابع عبر</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="flex gap-2">
            <GoogleLogin
              onSuccess={credentialResponse => {
                const token = credentialResponse.credential;
                // Send token to backend
                // ...
              }}
              onError={() => {
                alert('فشل تسجيل الدخول عبر جوجل');
              }}
              text="signin_with"
              shape="pill"
              width="100%"
              locale="ar"
            />
          </div>
        </div>
        {/* Register as a buyer */}
        <div className="bg-white/95 rounded-xl shadow p-6 flex-1 min-w-[340px] max-w-md flex flex-col justify-between" style={{backdropFilter: 'blur(2px)'}}>
          <div>
            <h3 className="text-xl font-bold mb-4">سجّل كمشتري</h3>
            <ul className="mb-6 space-y-2 text-green-700">
              <li>✔ قائمة المفضلات متزامنة على جميع الأجهزة</li>
              <li>✔ عروض خاصة حصرية</li>
              <li>✔ المزايدة في المزادات</li>
            </ul>
          </div>
          <a href="/signup" className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-bold flex items-center justify-center gap-2 text-lg mt-2">
            <FaUser /> سجّل مجانًا
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;

