import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const BACKAPI = import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOPMENT_API
    : import.meta.env.VITE_PRODUCTION_API;

  useEffect(() => {
    // Fetch user info
    if (token) {
      axios.get(`${BACKAPI}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (res.data.success && res.data.user) {
          setProfile({ name: res.data.user.name, email: res.data.user.email });
          setForm({ name: res.data.user.name, password: "" });
        }
      });
    }
  }, [token]);

  useEffect(() => {
    // Fetch user inquiries (if available)
    setInquiriesLoading(true);
    axios.get(`${BACKAPI}/api/inquiry/my`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (res.data.success) setInquiries(res.data.inquiries);
      setInquiriesLoading(false);
    }).catch(() => setInquiriesLoading(false));
  }, [token]);

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setEdit(false);
    setForm({ name: profile.name, password: "" });
    setMessage("");
  };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.put(`${BACKAPI}/api/auth/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setProfile(res.data.user);
        setEdit(false);
        setMessage("تم تحديث البيانات بنجاح.");
      } else {
        setMessage(res.data.message || "حدث خطأ.");
      }
    } catch {
      setMessage("حدث خطأ أثناء التحديث.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">لوحة المستخدم</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="text-lg font-bold mb-1">معلومات الحساب</div>
            <div className="text-gray-700 mb-1">الاسم: {profile.name}</div>
            <div className="text-gray-700 mb-1">البريد الإلكتروني: {profile.email}</div>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleEdit}
            disabled={edit}
          >
            تعديل البيانات
          </button>
        </div>
        {edit && (
          <form onSubmit={handleSave} className="space-y-3 mt-4">
            <div>
              <label className="block mb-1 font-semibold">الاسم الجديد</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">كلمة المرور الجديدة (اختياري)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="اتركها فارغة إذا لا تريد تغييرها"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "جاري الحفظ..." : "حفظ"}
              </button>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={handleCancel}
                disabled={loading}
              >
                إلغاء
              </button>
            </div>
            {message && <div className="text-center text-green-700 font-bold mt-2">{message}</div>}
          </form>
        )}
        <div className="mt-6">
          <Link to="/favorites" className="text-blue-600 hover:underline font-semibold">
            مشاهدة المفضلة
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold mb-4">استفساراتي السابقة</div>
        {inquiriesLoading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">لا توجد استفسارات بعد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border">التاريخ</th>
                  <th className="py-2 px-3 border">الرسالة</th>
                  <th className="py-2 px-3 border">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border">{new Date(inq.createdAt).toLocaleDateString("ar-EG")}</td>
                    <td className="py-2 px-3 border max-w-xs truncate" title={inq.message}>{inq.message}</td>
                    <td className="py-2 px-3 border">{inq.status || "جديد"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 