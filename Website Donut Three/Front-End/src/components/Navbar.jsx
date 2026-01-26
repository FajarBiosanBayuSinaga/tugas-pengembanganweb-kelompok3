import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. IMPORT AUTH CONTEXT

export default function Navbar({ cartCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // 2. AMBIL DATA USER DAN FUNGSI LOGOUT
  const { user, logout } = useAuth(); 

  const isActive = (path) => {
    return location.pathname === path ? "text-orange-600 font-bold" : "text-gray-600 hover:text-orange-500";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl">🍩</span>
            <div className="text-2xl font-black text-gray-800 tracking-tighter group-hover:text-orange-600 transition">
              Donut<span className="text-orange-500">Three.</span>
            </div>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex space-x-8 items-center font-medium">
            <Link to="/" className={`${isActive("/")} transition duration-300`}>Home</Link>
            <Link to="/menu" className={`${isActive("/menu")} transition duration-300`}>Menu</Link>
            <Link to="/about" className={`${isActive("/about")} transition duration-300`}>About</Link>
            <Link to="/contact" className={`${isActive("/contact")} transition duration-300`}>Contact</Link>
          </div>

          {/* --- RIGHT SIDE (Cart & Auth) --- */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <span className="text-2xl text-gray-600 group-hover:text-orange-600 transition">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* --- LOGIKA LOGIN / LOGOUT (DESKTOP) --- */}
            {user ? (
              // JIKA SUDAH LOGIN
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 hover:bg-orange-50 px-3 py-1.5 rounded-full transition border border-transparent hover:border-orange-100">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold uppercase text-sm shadow-md">
                    {user.username.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-700 text-sm max-w-[100px] truncate">
                    {user.username}
                  </span>
                </Link>
                
                <button 
                  onClick={logout} 
                  className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              // JIKA BELUM LOGIN
              <Link 
                to="/login" 
                className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold shadow-lg hover:bg-orange-600 hover:shadow-orange-200 transition transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* --- MOBILE HAMBURGER BUTTON --- */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Icon (Diperbaiki agar dinamis) */}
            <Link to="/cart" className="relative">
               <span className="text-2xl">🛒</span>
               {cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                   {cartCount}
                 </span>
               )}
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-orange-600 focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 animate-fade-in-down z-40">
          <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Home</Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Menu Favorit</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Tentang Kami</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Hubungi Kami</Link>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              {/* --- LOGIKA LOGIN / LOGOUT (MOBILE) --- */}
              {user ? (
                <div className="space-y-3">
                  <div className="px-3 flex items-center gap-3">
                     <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold uppercase text-sm">
                        {user.username.charAt(0)}
                     </div>
                     <span className="font-bold text-gray-800">Hi, {user.username}</span>
                  </div>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50">
                    Profile Saya
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-center px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700">
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}