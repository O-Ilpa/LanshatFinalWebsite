import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Backpack, Star, StarOff } from "lucide-react";
import { Trash2, Edit2 } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import AddForm from "./addForm.jsx";
import Header from "./header.jsx";
import MachineCard from "./machineCard.jsx";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import AdminEgyptMaterials from "./adminEgyptMaterials";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [formOpen, openForm] = useState(false);
  const [machines, setMachines] = useState([]);
  const [editedMachine, seteditedMachine] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = '/api'; // Use consistent API URL with Vite proxy

  const [view, setView] = useState("card");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const [adminTab, setAdminTab] = useState("analytics");
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentActivity: null,
    chartData: null
  });

  // Bulk selection logic
  const allSelected =
    machines.length > 0 && selectedIds.length === machines.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(machines.map((m) => m._id));
  };
  const toggleSelect = (id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };
  // Single feature/unfeature
  const handleFeature = async (machine, value) => {
    try {
      const res = await axios.put(
        `${API}/machines/edit/${machine._id}`,
        { ...machine, featured: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(value ? "تم تمييز الماكينة" : "تم إلغاء تمييز الماكينة");
        fetchMachines();
      } else {
        toast.error("حدث خطأ أثناء التحديث");
      }
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  // Bulk actions (real)
  const bulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const machine = machines.find((m) => m._id === id);
          return axios.delete(`${API}/machines/del/${id}`, {
            data: {
              deletedImages: machine.images?.map((img) => img.public_id) || [],
            },
            headers: { Authorization: `Bearer ${token}` },
          });
        })
      );
      toast.success("تم حذف العناصر المحددة");
      setSelectedIds([]);
      fetchMachines();
    } catch {
      toast.error("حدث خطأ أثناء الحذف الجماعي");
    }
  };
  const bulkFeature = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const machine = machines.find((m) => m._id === id);
          return axios.put(
            `${API}/machines/edit/${id}`,
            { ...machine, featured: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      toast.success("تم تمييز العناصر المحددة");
      setSelectedIds([]);
      fetchMachines();
    } catch {
      toast.error("حدث خطأ أثناء التمييز الجماعي");
    }
  };
  const bulkUnfeature = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const machine = machines.find((m) => m._id === id);
          return axios.put(
            `${API}/machines/edit/${id}`,
            { ...machine, featured: false },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      toast.success("تم إلغاء تمييز العناصر المحددة");
      setSelectedIds([]);
      fetchMachines();
    } catch {
      toast.error("حدث خطأ أثناء إلغاء التمييز الجماعي");
    }
  };

  // Add this handler for outOfStock toggle
  const handleOutOfStock = async (machine, value) => {
    try {
      const res = await axios.put(
        `${API}/machines/edit/${machine._id}`,
        { ...machine, outOfStock: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(
          value ? "تم وضع الماكينة كغير متوفرة" : "تم وضع الماكينة كمتوفرة"
        );
        fetchMachines();
      } else {
        toast.error("حدث خطأ أثناء التحديث");
      }
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${API}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data.success) {
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      }
    };
    verifyUser();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await axios.get(`${API}/machines/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setMachines(res.data.machines);
      }
    } catch (err) {
      console.error("Error fetching machines:", err);
      toast.error("Failed to load machines");
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(machines.length / cardsPerPage);
  const paginatedMachines = machines.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when machines change
  }, [machines]);

  const ConfirmationModal = ({ onConfirm, onCancel, message }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 w-96 shadow-xl">
          <p className="text-xl font-medium text-center mb-6">{message}</p>
          <div className="flex justify-between gap-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    );
  };

  const openDeleteForm = (machine) => {
    setMachineToDelete(machine);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMachineToDelete(null);
  };

  const handleDelete = async (machine) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${API}/machines/del/${machine._id}`,
        {
          data: {
            deletedImages: machine.images?.map((img) => img.public_id) || [],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        await fetchMachines();
      } else {
        console.error("Error deleting machine:", res.data.message);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleEdit = async (machineId) => {
    try {
      const res = await axios.get(`${API}/machines/show/${machineId}`);
      if (res.data.success) {
        seteditedMachine(res.data.machine);
        openForm(true);
      }
    } catch (err) {
      console.error("Error editing machine:", err);
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (adminTab !== "analytics") return;
      
      setLoading(true);
      setError(null);
      
      try {
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Fetch all data in parallel
        const [statsRes, activityRes, chartRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { headers }),
          axios.get(`${API}/admin/recent-activity`, { headers }),
          axios.get(`${API}/admin/chart-data`, { headers })
        ]);

        if (statsRes.data.success && activityRes.data.success && chartRes.data.success) {
          setDashboardData({
            stats: statsRes.data.data,
            recentActivity: activityRes.data.data,
            chartData: {
              labels: chartRes.data.data.labels,
              datasets: [
                {
                  label: 'Signups',
                  data: chartRes.data.data.signups,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                },
                {
                  label: 'Quote Requests',
                  data: chartRes.data.data.quoteRequests,
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1
                }
              ]
            }
          });
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [adminTab, token]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Header />
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Header />
        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6 font-arabic text-right">
        <header className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
          {/* Company Logo Placeholder */}
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 shadow">
            لوجو
          </div>
          {user && (
            <h2 className="text-3xl font-bold text-gray-900">
              مرحباً, {user.name} 👋
            </h2>
          )}
        </header>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-lg font-bold border transition-colors ${
              adminTab === "analytics"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
            }`}
            onClick={() => setAdminTab("analytics")}
          >
            التحليلات
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold border transition-colors ${
              adminTab === "machines"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
            }`}
            onClick={() => setAdminTab("machines")}
          >
            إدارة الماكينات
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold border transition-colors ${
              adminTab === "egyptMaterials"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
            }`}
            onClick={() => setAdminTab("egyptMaterials")}
          >
            إدارة المواد الخام المصرية
          </button>
        </div>

        {adminTab === "analytics" ? (
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-2xl">{dashboardData.stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Recent Signups (30d)</h3>
                <p className="text-2xl">{dashboardData.stats?.recentSignups || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Products</h3>
                <p className="text-2xl">{dashboardData.stats?.totalProducts || 0}</p>
              </div>
            </div>

            {/* Chart */}
            {dashboardData.chartData && (
              <div className="bg-white p-4 rounded-lg shadow mb-8">
                <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
                <Line data={dashboardData.chartData} />
              </div>
            )}

            {/* Recent Activity */}
            {dashboardData.recentActivity && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Recent Signups</h3>
                  <div className="space-y-2">
                    {dashboardData.recentActivity.recentUsers.map(user => (
                      <div key={user._id} className="border-b pb-2">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Recent Quote Requests</h3>
                  <div className="space-y-2">
                    {dashboardData.recentActivity.recentQuotes.map(quote => (
                      <div key={quote._id} className="border-b pb-2">
                        <p className="font-medium">{quote.name}</p>
                        <p className="text-sm text-gray-600">{quote.email}</p>
                        <p className="text-xs text-gray-500">{new Date(quote.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : adminTab === "machines" ? (
          <>
        {/* Summary Bar */}
        <div className="flex gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex-1 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {machines.length}
            </div>
            <div className="text-gray-500">إجمالي الماكينات</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex-1 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {machines.filter((m) => m.featured).length}
            </div>
            <div className="text-gray-500">مميزة</div>
          </div>
        </div>

        {/* View Toggle and Bulk Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex gap-2 items-center">
            <button
              className={`px-4 py-2 rounded-lg font-bold border transition-colors ${
                view === "card"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
              }`}
              onClick={() => setView("card")}
            >
              عرض البطاقات
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-bold border transition-colors ${
                view === "table"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
              }`}
              onClick={() => setView("table")}
            >
              عرض الجدول
            </button>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={bulkDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 text-white px-3 py-2 rounded-lg font-bold"
              >
                حذف المحدد
              </button>
              <button
                onClick={bulkFeature}
                className="bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 text-white px-3 py-2 rounded-lg font-bold"
              >
                تمييز المحدد
              </button>
              <button
                onClick={bulkUnfeature}
                className="bg-gray-500 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 text-white px-3 py-2 rounded-lg font-bold"
              >
                إلغاء تمييز المحدد
              </button>
            </div>
          )}
        </div>
        {/* Machine List/Table */}
        {view === "card" ? (
          <>
            <div className="flex flex-col gap-6 max-w-7xl mx-auto transition-all duration-300">
              {paginatedMachines.map((machine) => (
                <div key={machine._id} className="relative group">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(machine._id)}
                    onChange={() => toggleSelect(machine._id)}
                    className="absolute right-4 top-4 z-20 w-5 h-5 accent-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    title="تحديد"
                  />
                  <div className="absolute flex gap-3 right-12 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => openDeleteForm(machine)}
                      className="h-10 w-10 grid place-content-center bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 rounded-full shadow-lg transition-all duration-200"
                      title="حذف"
                    >
                      <Trash2 className="text-white w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(machine._id)}
                      className="h-10 w-10 grid place-content-center bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 rounded-full shadow-lg transition-all duration-200"
                      title="تعديل"
                    >
                      <Edit2 className="text-white w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleOutOfStock(machine, !machine.outOfStock)
                      }
                      className={`h-10 w-10 grid place-content-center ${
                        machine.outOfStock
                          ? "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300"
                          : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300"
                      } rounded-full shadow-lg transition-all duration-200`}
                      title={
                        machine.outOfStock ? "إرجاع للتوفر" : "وضع كغير متوفر"
                      }
                    >
                      {machine.outOfStock ? (
                        <span className="text-white font-bold">✖</span>
                      ) : (
                        <span className="text-white font-bold">✔</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleFeature(machine, !machine.featured)}
                      className={`h-10 w-10 grid place-content-center ${
                        machine.featured
                          ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300"
                          : "bg-gray-300 hover:bg-gray-400 focus:ring-2 focus:ring-gray-300"
                      } rounded-full shadow-lg transition-all duration-200`}
                      title={machine.featured ? "إلغاء تمييز" : "تمييز"}
                    >
                      {machine.featured ? (
                        <StarOff className="text-white w-5 h-5" />
                      ) : (
                        <Star className="text-yellow-600 w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <MachineCard machine={machine} horizontal={true} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2 items-center">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  التالي
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="overflow-x-auto max-w-7xl mx-auto">
            <table className="min-w-full bg-white rounded-lg shadow border text-right">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="accent-blue-600 w-5 h-5"
                      title="تحديد الكل"
                    />
                  </th>
                  <th className="px-4 py-3">الاسم</th>
                  <th className="px-4 py-3">النوع</th>
                  <th className="px-4 py-3">رقم العرض</th>
                  <th className="px-4 py-3">تاريخ التحديث</th>
                  <th className="px-4 py-3">مميز؟</th>
                  <th className="px-4 py-3">متوفر؟</th>
                  <th className="px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(machine._id)}
                        onChange={() => toggleSelect(machine._id)}
                        className="accent-blue-600 w-5 h-5"
                      />
                    </td>
                    <td className="px-4 py-2 font-bold">{machine.name}</td>
                    <td className="px-4 py-2">{machine.machineType}</td>
                    <td className="px-4 py-2">{machine.offerId || "-"}</td>
                    <td className="px-4 py-2">
                      {machine.updatedAt
                        ? new Date(machine.updatedAt).toLocaleDateString(
                            "ar-EG",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {machine.featured ? "✔️" : ""}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          handleOutOfStock(machine, !machine.outOfStock)
                        }
                        className={`px-2 py-1 rounded-full font-bold text-xs transition-all duration-200 ${
                          machine.outOfStock
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        title={
                          machine.outOfStock ? "إرجاع للتوفر" : "وضع كغير متوفر"
                        }
                      >
                        {machine.outOfStock ? "✖ غير متوفر" : "✔ متوفر"}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <a
                        href={`/${machine.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 text-white px-2 py-1 rounded-lg"
                        title="عرض الصفحة"
                      >
                        👁️
                      </a>
                      <button
                        onClick={() => openDeleteForm(machine)}
                        className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 text-white px-2 py-1 rounded-lg"
                        title="حذف"
                      >
                        <Trash2 className="inline w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(machine._id)}
                        className="bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 text-white px-2 py-1 rounded-lg"
                        title="تعديل"
                      >
                        <Edit2 className="inline w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleFeature(machine, !machine.featured)
                        }
                        className={`px-2 py-1 rounded-lg ${
                          machine.featured
                            ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300"
                            : "bg-gray-300 hover:bg-gray-400 focus:ring-2 focus:ring-gray-300"
                        }`}
                        title={machine.featured ? "إلغاء تمييز" : "تمييز"}
                      >
                        {machine.featured ? (
                          <StarOff className="inline w-4 h-4 text-white" />
                        ) : (
                          <Star className="inline w-4 h-4 text-yellow-600" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {formOpen && (
          <AddForm
            fetchMachines={fetchMachines}
            openForm={openForm}
            editedMachine={editedMachine}
          />
        )}

        <button
          onClick={() => {
            openForm(!formOpen);
            seteditedMachine({});
          }}
          className="fixed bottom-8 left-8 bg-[var(--bg-main)] hover:bg-[#375963] text-white p-4 rounded-full shadow-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          aria-label="إضافة عقار جديد"
        >
          <Plus className="w-6 h-6" />
        </button>
          </>
        ) : (
          <AdminEgyptMaterials />
        )}
      </div>

      {showModal && (
        <ConfirmationModal
          onConfirm={() => handleDelete(machineToDelete)}
          onCancel={closeModal}
          message="هل أنت متأكد من حذف هذا العقار؟"
        />
      )}
    </>
  );
}
