import React from "react";
import { useCart } from "../CartContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaShoppingCart className="text-blue-600" /> سلة طلب عرض السعر
      </h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg">
          السلة فارغة. أضف منتجات لطلب عرض سعر.
          <div className="mt-6">
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold">العودة للرئيسية</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            {cart.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row items-center gap-4 border relative">
                <img src={item.images?.[0]?.url || item.images?.[0] || "/assets/no-image.png"} alt={item.name} className="w-32 h-24 object-contain rounded" />
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{item.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{item.machineType || item.type || "-"}</div>
                  <div className="text-sm text-gray-500">{item.manufacturer || ""}</div>
                </div>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-bold flex items-center gap-1"
                  onClick={() => removeFromCart(item._id)}
                  title="إزالة من السلة"
                >
                  <FaTrash /> إزالة
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-8">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold"
              onClick={clearCart}
            >
              إفراغ السلة
            </button>
            <button
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded font-bold text-lg"
              onClick={() => navigate("/quote-request")}
            >
              متابعة طلب عرض السعر
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 