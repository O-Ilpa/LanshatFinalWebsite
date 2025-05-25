import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const emptyProduct = {
  name: "",
  description: "",
  images: [], // Array of { url, public_id }
  imageFiles: [], // For local uploads
  type: "",
  supplier: "",
  availableQuantity: "",
  certifications: "",
  additionalInfo: [], // Array of { key, value }
};

export default function AdminEgyptMaterials() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }
  const [view, setView] = useState("table");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKAPI}/api/egypt-materials`);
      setProducts(res.data.materials);
    } catch {
      toast.error("فشل تحميل المنتجات");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInfo = () => {
    setForm((prev) => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, { key: "", value: "" }],
    }));
  };

  const handleInfoChange = (idx, field, value) => {
    setForm((prev) => {
      const info = [...prev.additionalInfo];
      info[idx][field] = value;
      return { ...prev, additionalInfo: info };
    });
  };

  const handleRemoveInfo = (idx) => {
    setForm((prev) => {
      const info = [...prev.additionalInfo];
      info.splice(idx, 1);
      return { ...prev, additionalInfo: info };
    });
  };

  // Handle image uploads to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    try {
      const uploadedImages = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "YOUR_CLOUDINARY_PRESET"); // Replace with your preset
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload", // Replace with your cloud name
          formData
        );
        uploadedImages.push({ url: res.data.secure_url, public_id: res.data.public_id });
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      toast.success("تم رفع الصور بنجاح");
    } catch {
      toast.error("فشل رفع الصور");
    }
    setLoading(false);
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => {
      const images = [...prev.images];
      images.splice(idx, 1);
      return { ...prev, images };
    });
  };

  // Edit modal handlers
  const openEditModal = (idx) => {
    setEditIndex(idx);
    setForm({
      ...products[idx],
      certifications: (products[idx].certifications || []).join(", "),
      additionalInfo: products[idx].additionalInfo
        ? Object.entries(products[idx].additionalInfo).map(([key, value]) => ({ key, value }))
        : [],
    });
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditIndex(null);
    setForm(emptyProduct);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const additionalInfoObj = {};
    form.additionalInfo.forEach(({ key, value }) => {
      if (key) additionalInfoObj[key] = value;
    });
    try {
      await axios.put(
        `${BACKAPI}/api/egypt-materials/${products[editIndex]._id}`,
        {
          name: form.name,
          description: form.description,
          images: form.images,
          type: form.type,
          supplier: form.supplier,
          availableQuantity: form.availableQuantity,
          certifications: form.certifications.split(",").map((c) => c.trim()).filter(Boolean),
          additionalInfo: additionalInfoObj,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث المنتج بنجاح");
      closeEditModal();
      fetchProducts();
    } catch {
      toast.error("فشل تحديث المنتج");
    } finally {
      setLoading(false);
    }
  };

  // Delete modal handlers
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${BACKAPI}/api/egypt-materials/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف المنتج");
      closeDeleteModal();
      fetchProducts();
    } catch {
      toast.error("فشل حذف المنتج");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Convert additionalInfo array to object
    const additionalInfoObj = {};
    form.additionalInfo.forEach(({ key, value }) => {
      if (key) additionalInfoObj[key] = value;
    });
    try {
      await axios.post(
        `${BACKAPI}/api/egypt-materials`,
        {
          name: form.name,
          description: form.description,
          images: form.images,
          type: form.type,
          supplier: form.supplier,
          availableQuantity: form.availableQuantity,
          certifications: form.certifications.split(",").map((c) => c.trim()).filter(Boolean),
          additionalInfo: additionalInfoObj,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تمت إضافة المنتج بنجاح");
      setForm(emptyProduct);
      setShowForm(false);
      fetchProducts();
    } catch {
      toast.error("فشل إضافة المنتج");
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const handleFeature = async (product, value) => {
    try {
      await axios.put(
        `${BACKAPI}/api/egypt-materials/${product._id}`,
        { ...product, featured: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(value ? "تم تمييز المنتج" : "تم إلغاء تمييز المنتج");
      fetchProducts();
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة منتجات المواد الخام المصرية</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "إغلاق النموذج" : "إضافة منتج جديد"}
        </button>
      </div>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-bold border transition-colors ${
            view === "table"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
          }`}
          onClick={() => setView("table")}
        >
          عرض الجدول
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold border transition-colors ${
            view === "card"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
          }`}
          onClick={() => setView("card")}
        >
          عرض البطاقات
        </button>
      </div>
      {view === "table" ? (
        <div className="overflow-x-auto max-w-7xl mx-auto mb-8">
          <table className="min-w-full bg-white rounded-lg shadow border text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">النوع</th>
                <th className="px-4 py-3">المورد</th>
                <th className="px-4 py-3">الكمية المتاحة</th>
                <th className="px-4 py-3">الشهادات</th>
                <th className="px-4 py-3">مميز؟</th>
                <th className="px-4 py-3">تاريخ التحديث</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">{product.name}</td>
                  <td className="px-4 py-2">{product.type}</td>
                  <td className="px-4 py-2">{product.supplier || "-"}</td>
                  <td className="px-4 py-2">{product.availableQuantity || "-"}</td>
                  <td className="px-4 py-2">{product.certifications && product.certifications.length > 0 ? product.certifications.join(", ") : "-"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleFeature(product, !product.featured)}
                      className={`px-2 py-1 rounded-full font-bold text-xs transition-all duration-200 ${
                        product.featured
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                      title={product.featured ? "إلغاء تمييز" : "تمييز"}
                    >
                      {product.featured ? "✔️" : "☆"}
                    </button>
                  </td>
                  <td className="px-4 py-2">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/egypt-materials/${product._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
                      title="عرض الصفحة"
                    >
                      <Eye className="inline w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(idx)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-lg"
                      title="تعديل"
                    >
                      <Edit2 className="inline w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg"
                      title="حذف"
                    >
                      <Trash2 className="inline w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {products.map((product, idx) => (
            <div key={product._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center relative">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded mb-2 border"
                />
              )}
              <h3 className="text-lg font-bold mb-1 text-blue-900">{product.name}</h3>
              <div className="text-sm text-gray-600 mb-1">{product.type}</div>
              {product.supplier && <div className="text-xs text-gray-500">المورد: {product.supplier}</div>}
              {product.availableQuantity && <div className="text-xs text-gray-500">الكمية المتاحة: {product.availableQuantity}</div>}
              {product.certifications && product.certifications.length > 0 && (
                <div className="text-xs text-gray-500">الشهادات: {product.certifications.join(", ")}</div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleFeature(product, !product.featured)}
                  className={`px-2 py-1 rounded-full font-bold text-xs transition-all duration-200 ${
                    product.featured
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                  title={product.featured ? "إلغاء تمييز" : "تمييز"}
                >
                  {product.featured ? "✔️" : "☆"}
                </button>
                <button
                  onClick={() => navigate(`/egypt-materials/${product._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
                  title="عرض الصفحة"
                >
                  <Eye className="inline w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(idx)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-lg"
                  title="تعديل"
                >
                  <Edit2 className="inline w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg"
                  title="حذف"
                >
                  <Trash2 className="inline w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Add/Edit Form Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-2 left-2 text-gray-500 hover:text-red-600 text-2xl" onClick={closeEditModal}>×</button>
            <h2 className="text-xl font-bold mb-4">تعديل المنتج</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                className="w-full border rounded p-2 mb-2"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="اسم المنتج"
                required
              />
              <textarea
                className="w-full border rounded p-2 mb-2"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="وصف المنتج"
                required
              />
              {/* Image Upload */}
              <div className="mb-2">
                <label className="block font-semibold mb-1">صور المنتج</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                <div className="flex gap-2 flex-wrap">
                  {form.images.map((img, idx) => (
                    <div key={img.public_id} className="relative">
                      <img src={img.url} alt="product" className="w-16 h-16 object-cover rounded border" />
                      <button type="button" className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center" onClick={() => handleRemoveImage(idx)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              <input
                className="w-full border rounded p-2 mb-2"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="النوع/الفئة"
                required
              />
              <input
                className="w-full border rounded p-2 mb-2"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="المورد (اختياري)"
              />
              <input
                className="w-full border rounded p-2 mb-2"
                name="availableQuantity"
                value={form.availableQuantity}
                onChange={handleChange}
                placeholder="الكمية المتاحة (اختياري)"
              />
              <input
                className="w-full border rounded p-2 mb-2"
                name="certifications"
                value={form.certifications}
                onChange={handleChange}
                placeholder="الشهادات (افصل بينها بفاصلة)"
              />
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">معلومات إضافية</span>
                  <button type="button" className="text-blue-700" onClick={handleAddInfo}>
                    + إضافة
                  </button>
                </div>
                {form.additionalInfo.map((info, idx) => (
                  <div key={idx} className="flex gap-2 mb-1">
                    <input
                      className="border rounded p-1 flex-1"
                      placeholder="المفتاح (Key)"
                      value={info.key}
                      onChange={(e) => handleInfoChange(idx, "key", e.target.value)}
                    />
                    <input
                      className="border rounded p-1 flex-1"
                      placeholder="القيمة (Value)"
                      value={info.value}
                      onChange={(e) => handleInfoChange(idx, "value", e.target.value)}
                    />
                    <button type="button" className="text-red-600" onClick={() => handleRemoveInfo(idx)}>
                      حذف
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded mt-2"
                disabled={loading}
              >
                {loading ? "جاري الإضافة..." : "إضافة المنتج"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
            <p className="mb-6">هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4 justify-end">
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={closeDeleteModal}>إلغاء</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete} disabled={loading}>حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 