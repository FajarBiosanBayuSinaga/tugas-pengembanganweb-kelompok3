import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  
  const menus = [
    { name: "Manajemen Menu", path: "/admin/menu", icon: "🍩" },
    { name: "Transaksi", path: "/admin/transactions", icon: "💰" },
    { name: "Ulasan & Pesan", path: "/admin/reviews", icon: "💬" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-black text-orange-500">Admin Panel</h2>
          <p className="text-xs text-gray-400">Donut Three Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menus.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                location.pathname === item.path 
                ? "bg-orange-600 text-white shadow-lg" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
            <Link to="/" className="text-gray-500 text-xs hover:text-white flex items-center gap-2">
              ← Kembali ke Website
            </Link>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}