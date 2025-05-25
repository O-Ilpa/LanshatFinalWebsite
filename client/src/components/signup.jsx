import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaMicrosoft, FaUser } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
const bgImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const SignUp = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }
  const validate = {
    firstName: firstName.trim().length > 0,
    lastName: lastName.trim().length > 0,
    email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email),
    customerNumber: customerNumber.trim().length > 0,
    password: password.length >= 8,
  };
  const allValid = Object.values(validate).every(Boolean);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${BACKAPI}/api/auth/signup`, {
        title,
        firstName,
        lastName,
        customerNumber,
        email,
        password,
        companyName,
      });
      if (res.data.success) {
        setMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage("An error occurred during registration.");
    }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen" style={{backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center'}} dir="rtl">
      <div className="bg-white/95 rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn" style={{backdropFilter: 'blur(2px)'}}>
        <button className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => navigate("/login")}>×</button>
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل حساب جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-2 justify-center">
            <button type="button" className={`px-4 py-2 rounded-l border ${title==="Mr"?"bg-gray-900 text-white":"bg-white text-gray-700"}`} onClick={()=>setTitle("Mr")}>السيد</button>
            <button type="button" className={`px-4 py-2 rounded-r border ${title==="Ms"?"bg-gray-900 text-white":"bg-white text-gray-700"}`} onClick={()=>setTitle("Ms")}>السيدة</button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input type="text" className={`w-full border rounded px-3 py-2 pr-8 ${touched.firstName && (validate.firstName ? "border-green-500" : "border-red-500")}`} placeholder="الاسم الأول" value={firstName} onChange={e=>setFirstName(e.target.value)} onBlur={()=>setTouched(t=>({...t,firstName:true}))} required />
              {touched.firstName && (validate.firstName ? <span className="absolute left-2 top-3 text-green-600">✔</span> : <span className="absolute left-2 top-3 text-red-600">✖</span>)}
            </div>
            <div className="relative flex-1">
              <input type="text" className={`w-full border rounded px-3 py-2 pr-8 ${touched.lastName && (validate.lastName ? "border-green-500" : "border-red-500")}`} placeholder="اسم العائلة" value={lastName} onChange={e=>setLastName(e.target.value)} onBlur={()=>setTouched(t=>({...t,lastName:true}))} required />
              {touched.lastName && (validate.lastName ? <span className="absolute left-2 top-3 text-green-600">✔</span> : <span className="absolute left-2 top-3 text-red-600">✖</span>)}
            </div>
          </div>
          <div className="relative">
            <input type="text" className={`w-full border rounded px-3 py-2 pr-8 ${touched.email && (validate.email ? "border-green-500" : "border-red-500")}`} placeholder="البريد الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} onBlur={()=>setTouched(t=>({...t,email:true}))} required />
            {touched.email && (validate.email ? <span className="absolute left-2 top-3 text-green-600">✔</span> : <span className="absolute left-2 top-3 text-red-600">✖</span>)}
          </div>
          <div className="relative">
            <input type="text" className={`w-full border rounded px-3 py-2 pr-8 ${touched.customerNumber && (validate.customerNumber ? "border-green-500" : "border-red-500")}`} placeholder="رقم العميل" value={customerNumber} onChange={e=>setCustomerNumber(e.target.value)} onBlur={()=>setTouched(t=>({...t,customerNumber:true}))} required />
            {touched.customerNumber && (validate.customerNumber ? <span className="absolute left-2 top-3 text-green-600">✔</span> : <span className="absolute left-2 top-3 text-red-600">✖</span>)}
          </div>
          <div className="relative">
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="اسم الشركة (اختياري)" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
          </div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} className={`w-full border rounded px-3 py-2 pr-8 ${touched.password && (validate.password ? "border-green-500" : "border-red-500")}`} placeholder="كلمة المرور (8 أحرف على الأقل)" value={password} onChange={e=>setPassword(e.target.value)} onBlur={()=>setTouched(t=>({...t,password:true}))} required />
            <button type="button" className="absolute left-2 top-2 text-gray-400" onClick={()=>setShowPassword(v=>!v)}>{showPassword ? "🙈" : "👁️"}</button>
            {touched.password && (validate.password ? <span className="absolute right-2 top-3 text-green-600">✔</span> : <span className="absolute right-2 top-3 text-red-600">✖</span>)}
          </div>
          {message && <div className={`text-center mb-2 ${message.includes("success") ? "text-green-700" : "text-red-700"}`}>{message}</div>}
          <button className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-bold flex items-center justify-center gap-2 text-lg" type="submit" disabled={loading || !allValid}>
            <FaUser /> {loading ? "جاري التسجيل..." : "تسجيل"}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">أو</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <div className="flex gap-2 mb-2">
          <GoogleLogin
            onSuccess={credentialResponse => {
              // Send credentialResponse.credential to backend
              // ...
            }}
            onError={() => {
              alert('فشل التسجيل عبر جوجل');
            }}
            text="signin_with"
            shape="pill"
            width="100%"
            locale="ar"
          />
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          بيان الخصوصية
        </div>
      </div>
    </div>
  );
};

export default SignUp;
