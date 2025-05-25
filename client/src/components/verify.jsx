import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email") || "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKAPI}/api/auth/verify`, {
        email,
        code,
      });
      if (res.data.success) {
        setMessage("تم التحقق بنجاح! يمكنك الآن تسجيل الدخول.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("حدث خطأ أثناء التحقق.");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="rounded-2xl shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">تأكيد البريد الإلكتروني</h2>
        <p className="text-gray-700 mb-2">
          أدخل الكود المرسل إلى بريدك الإلكتروني
        </p>
        <p className="text-sm text-gray-500 mb-4">{email}</p>
        <p className="text-red-700">{message}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="code">
              الكود
            </label>
            <input
              onChange={(e) => setCode(e.target.value)}
              className="rounded-2xl w-full py-2 px-3 bg-gray-200 focus:bg-gray-100 focus:outline-0"
              type="text"
              placeholder="الكود"
              name="code"
              required
            />
          </div>
          <div className="mb-4">
            <button
              className="w-full bg-teal-600 text-white py-2 rounded-full cursor-pointer"
              type="submit"
            >
              تأكيد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;
