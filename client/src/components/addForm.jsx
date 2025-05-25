import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Img } from "react-image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import LocationPicker from "./LocationPicker";

const AddForm = ({ openForm, editedMachine }) => {
  const [name, setName] = useState("");
  const [machineType, setMachineType] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [yearOfConstruction, setYearOfConstruction] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [specialInfo, setSpecialInfo] = useState([{ key: "", value: "" }]);
  const [deletedCloudinaryIds, setDeletedCloudinaryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState([30.0444, 31.2357]); // Default to Cairo
  const [featured, setFeatured] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }
  useEffect(() => {
    if (Object.keys(editedMachine).length !== 0) {
      setCondition(editedMachine.condition || "");
      setName(editedMachine.name || "");
      setMachineType(editedMachine.machineType || "");
      setManufacturer(editedMachine.manufacturer || "");
      setModel(editedMachine.model || "");
      setYearOfConstruction(editedMachine.yearOfConstruction || 0);
      setDescription(editedMachine.description || "");
      setPrice(editedMachine.price || 0);
      setLocation(editedMachine.location || "");
      setCoords(editedMachine.coords || [30.0444, 31.2357]);
      setSpecialInfo(
        editedMachine.specialInfo && editedMachine.specialInfo.length > 0
          ? editedMachine.specialInfo
          : [{ key: "", value: "" }]
      );
      setFeatured(!!editedMachine.featured);
      const existingImages = (editedMachine.images || []).map((img) => ({
        url: img.url,
        preview: img.url,
        public_id: img.public_id,
        fromCloudinary: true,
      }));
      setFiles(existingImages);
    }
  }, [editedMachine]);

  const token = localStorage.getItem("token");
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles((previousFiles) => [...previousFiles, ...newFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 10000,
    onDrop,
  });

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "الاسم مطلوب";
    if (!machineType.trim()) errors.machineType = "نوع الماكينة مطلوب";
    if (!manufacturer.trim()) errors.manufacturer = "الشركة المصنعة مطلوبة";
    if (!model.trim()) errors.model = "الموديل مطلوب";
    if (!condition) errors.condition = "الحالة مطلوبة";
    if (!location.trim()) errors.location = "الموقع مطلوب";
    if (!description.trim()) errors.description = "الوصف مطلوب";
    if (
      files.length === 0 ||
      files.every((f) => deletedCloudinaryIds.includes(f.public_id))
    )
      errors.images = "يجب إضافة صورة واحدة على الأقل";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }
    const API = import.meta.env.VITE_CLOUDINARY_API;
    const uploadedUrls = [];
    try {
      const untouchedCloudinaryImages = files
        .filter(
          (file) =>
            file.public_id && !deletedCloudinaryIds.includes(file.public_id)
        )
        .map((file) => ({
          url: file.url,
          public_id: file.public_id,
          preview: file.preview || file.url,
        }));
      for (const file of files) {
        if (!file.public_id) {
          const formData = new FormData();
          formData.append("upload_preset", "real-state-test");
          formData.append("file", file);
          const imageRes = await axios.post(API, formData);
          uploadedUrls.push({
            url: imageRes.data.secure_url,
            public_id: imageRes.data.public_id,
          });
        }
      }
      const finalImages = [...untouchedCloudinaryImages, ...uploadedUrls];
      if (Object.keys(editedMachine).length === 0) {
        const res = await axios.post(
          `${BACKAPI}/api/machines/add`,
          {
            name,
            machineType,
            manufacturer,
            model,
            yearOfConstruction: yearOfConstruction
              ? parseInt(yearOfConstruction)
              : null,
            condition,
            description,
            price: price ? parseInt(price) : null,
            location,
            coords,
            specialInfo,
            images: finalImages,
            deletedImages: deletedCloudinaryIds,
            featured,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setLoading(false);
          openForm(false);
          // Reload the page after successful addition
          window.location.reload();
        } else {
          setLoading(false);
        }
      } else {
        const res = await axios.put(
          `${BACKAPI}/api/machines/edit/${editedMachine._id}`,
          {
            name,
            machineType,
            manufacturer,
            model,
            yearOfConstruction: yearOfConstruction
              ? parseInt(yearOfConstruction)
              : null,
            condition,
            description,
            price: price ? parseInt(price) : null,
            location,
            coords,
            specialInfo,
            images: finalImages,
            deletedImages: deletedCloudinaryIds,
            featured,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setLoading(false);
          openForm(false);
          // Reload the page after successful edit
          window.location.reload();
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error("Upload Error:", err);
    }
  };

  const handleSpecialInfoChange = (idx, field, val) => {
    setSpecialInfo((prev) => {
      const updated = [...prev];
      updated[idx][field] = val;
      return updated;
    });
  };

  const addSpecialInfo = () => {
    setSpecialInfo((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecialInfo = (idx) => {
    setSpecialInfo((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)
    );
  };

  return (
    <>
      <div
        onClick={() => {
          openForm(false);
        }}
        className="fixed inset-0 bg-black opacity-15 z-40"
      ></div>
      <form
        className="fixed flex flex-col justify-between text-right inset-0 m-auto h-[80%] w-[90%] max-w-3xl rounded-2xl z-50 bg-white shadow p-6 overflow-y-scroll no-scrollbar "
        dir="rtl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {Object.keys(editedMachine).length === 0
            ? "إضافة ماكينة جديدة"
            : "تعديل بيانات الماكينة"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              اسم الماكينة
            </label>
            <input
              id="name"
              onChange={(e) => setName(e.target.value)}
              name="name"
              type="text"
              placeholder="اسم الماكينة"
              className="p-2 border rounded w-full"
              value={name}
              required
            />
            {formErrors.name && (
              <div className="text-red-600 text-sm mt-1">{formErrors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="machineType" className="block mb-1 font-semibold">
              نوع الماكينة
            </label>
            <input
              id="machineType"
              onChange={(e) => setMachineType(e.target.value)}
              name="machineType"
              type="text"
              placeholder="نوع الماكينة"
              className="p-2 border rounded w-full"
              value={machineType}
              required
            />
            {formErrors.machineType && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.machineType}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="manufacturer" className="block mb-1 font-semibold">
              الشركة المصنعة
            </label>
            <input
              id="manufacturer"
              onChange={(e) => setManufacturer(e.target.value)}
              name="manufacturer"
              type="text"
              placeholder="الشركة المصنعة"
              className="p-2 border rounded w-full"
              value={manufacturer}
              required
            />
            {formErrors.manufacturer && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.manufacturer}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="model" className="block mb-1 font-semibold">
              الموديل
            </label>
            <input
              id="model"
              onChange={(e) => setModel(e.target.value)}
              name="model"
              type="text"
              placeholder="الموديل"
              className="p-2 border rounded w-full"
              value={model}
              required
            />
            {formErrors.model && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.model}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="yearOfConstruction"
              className="block mb-1 font-semibold"
            >
              سنة الصنع (اختياري)
            </label>
            <select
              id="yearOfConstruction"
              onChange={(e) => setYearOfConstruction(e.target.value)}
              name="yearOfConstruction"
              className="p-2 border rounded w-full"
              value={yearOfConstruction}
            >
              <option value="">غير محدد</option>
              {Array.from({ length: 50 }, (_, index) => {
                const currentYear = new Date().getFullYear();
                const year = currentYear - index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            {formErrors.yearOfConstruction && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.yearOfConstruction}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="condition" className="block mb-1 font-semibold">
              الحالة
            </label>
            <select
              id="condition"
              name="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">اختر الحالة</option>
              <option value="جديد">جديد</option>
              <option value="مستعمل">مستعمل</option>
              <option value="مجدّد">مجدّد</option>
            </select>
            {formErrors.condition && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.condition}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="price" className="block mb-1 font-semibold">
              السعر (اختياري)
            </label>
            <div className="relative">
              <input
                id="price"
                onChange={(e) => {
                  // Remove any non-digit characters
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setPrice(value);
                }}
                name="price"
                type="text"
                placeholder="اتركه فارغاً إذا كان السعر غير محدد"
                className="p-2 border rounded w-full"
                value={price ? parseInt(price).toLocaleString("ar-EG") : ""}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ج.م
              </span>
            </div>
            {formErrors.price && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.price}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="location" className="block mb-1 font-semibold">
              الموقع
            </label>
            <input
              id="location"
              onChange={(e) => setLocation(e.target.value)}
              name="location"
              type="text"
              placeholder="مثال: ألمانيا، برلين"
              className="p-2 border rounded w-full"
              value={location}
              required
            />
            {formErrors.location && (
              <div className="text-red-600 text-sm mt-1">
                {formErrors.location}
              </div>
            )}
            <div className="mt-2">
              <LocationPicker value={coords} onChange={setCoords} />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-semibold">
            الوصف
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="الوصف الكامل للماكينة..."
            className="p-2 border rounded w-full resize-none h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {formErrors.description && (
            <div className="text-red-600 text-sm mt-1">
              {formErrors.description}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">صور الماكينة</label>
          <div
            className="w-full bg-gray-200 text-center h-[100px] rounded-2xl my-2 border-dashed border-2 border-black flex items-center justify-center"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="p-5">إسحب الصورة هنا ...</p>
            ) : (
              <p className="p-5">إسحب أو انقر لتحميل الصور 📸</p>
            )}
          </div>
          {formErrors.images && (
            <div className="text-red-600 text-sm mt-1">{formErrors.images}</div>
          )}
          <div className="min-h-[120px] overflow-x-auto flex gap-3 items-center mt-2">
            {files.map((file, i) => (
              <div
                key={file.public_id || file.name + i}
                className="relative h-[120px] w-[120px] shadow-gray-200 shadow-xl hover:shadow-md transition-all"
              >
                <Img
                  src={file.preview || file.url}
                  onLoad={() => {
                    if (file.preview) URL.revokeObjectURL(file.preview);
                  }}
                  className="rounded-md h-full w-full object-cover"
                  alt="Preview"
                  width={120}
                  height={120}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (file.public_id) {
                      setDeletedCloudinaryIds((prev) => [
                        ...prev,
                        file.public_id,
                      ]);
                    }
                    setFiles((prev) =>
                      prev.filter((f) => {
                        if (file.public_id) {
                          return f.public_id !== file.public_id;
                        }
                        return f.name !== file.name;
                      })
                    );
                  }}
                  className="w-6 h-6 flex items-center justify-center absolute top-1 right-1 rounded-full bg-red-700 hover:bg-red-500 text-white transition-all"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            معلومات إضافية (اختياري)
          </label>
          {specialInfo.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                className="p-2 border rounded w-2/5"
                placeholder="العنصر (مثال: طول الشفرة)"
                value={item.key}
                onChange={(e) =>
                  handleSpecialInfoChange(idx, "key", e.target.value)
                }
              />
              <input
                type="text"
                className="p-2 border rounded w-2/5"
                placeholder="القيمة (مثال: 2 متر)"
                value={item.value}
                onChange={(e) =>
                  handleSpecialInfoChange(idx, "value", e.target.value)
                }
              />
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white rounded px-2"
                onClick={() => removeSpecialInfo(idx)}
                disabled={specialInfo.length === 1}
                title="حذف"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-1 mt-2"
            onClick={addSpecialInfo}
          >
            إضافة معلومة
          </button>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-5 h-5 accent-yellow-500"
          />
          <label
            htmlFor="featured"
            className="font-semibold cursor-pointer select-none"
          >
            مميز (يظهر في قسم المنتجات المميزة)
          </label>
        </div>
        <button
          onClick={(e) => {
            handleSubmit(e);
            setLoading(true);
          }}
          type="submit"
          className="bg-[var(--bg-main)] cursor-pointer mb-0 text-white py-2 rounded-full hover:bg-[#375963] m-auto w-[70%] flex justify-center items-center"
        >
          {loading ? (
            <div className="loader w-9 h-9 border-t-transparent"></div>
          ) : Object.keys(editedMachine).length === 0 ? (
            "إضافة الماكينة"
          ) : (
            "تعديل"
          )}
        </button>
      </form>
    </>
  );
};

export default AddForm;
