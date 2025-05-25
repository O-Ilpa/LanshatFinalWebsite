import React, { useState } from "react";
import { useCart } from "../CartContext";
import axios from "axios";
import { FaPaperPlane, FaFileUpload } from "react-icons/fa";
import toast from "react-hot-toast";

const QuoteRequestForm = ({ user }) => {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.companyName || "",
    message: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm(f => ({ ...f, file: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "file" && v) data.append("file", v);
        else if (k !== "file") data.append(k, v);
      });
      data.append("items", JSON.stringify(cart));
      const res = await axios.post(`${BACKAPI}/api/quote`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setSuccess(true);
        clearCart();
        setForm(f => ({ ...f, message: "", file: null }));
        toast.success("تم إرسال طلب عرض السعر بنجاح!");
      } else {
        setError(res.data.message || "حدث خطأ أثناء الإرسال.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الإرسال.");
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mt-8" onSubmit={handleSubmit} dir="rtl">
      <h2 className="text-xl font-bold mb-4 text-center">إرسال طلب عرض سعر</h2>
      {success && <div className="text-green-700 text-center mb-2">تم إرسال الطلب بنجاح!</div>}
      {error && <div className="text-red-700 text-center mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" placeholder="الاسم" required />
        <input name="email" value={form.email} onChange={handleChange} className="border rounded px-3 py-2" placeholder="البريد الإلكتروني" type="email" required />
        <input name="phone" value={form.phone} onChange={handleChange} className="border rounded px-3 py-2" placeholder="رقم الهاتف" />
        <input name="company" value={form.company} onChange={handleChange} className="border rounded px-3 py-2" placeholder="اسم الشركة (اختياري)" />
      </div>
      <textarea name="message" value={form.message} onChange={handleChange} className="border rounded px-3 py-2 w-full mb-4" placeholder="رسالتك" rows={4} required />
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <FaFileUpload />
          <span>إرفاق ملف (اختياري، 5MB كحد أقصى)</span>
          <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleChange} />
        </label>
        {form.file && <span className="text-xs text-gray-600">{form.file.name}</span>}
      </div>
      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded font-bold flex items-center justify-center gap-2 text-lg"
        disabled={loading}
      >
        <FaPaperPlane /> {loading ? "جاري الإرسال..." : "إرسال الطلب"}
      </button>
    </form>
  );
};

export default QuoteRequestForm; 