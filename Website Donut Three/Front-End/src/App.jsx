import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"; 

// --- IMPORT CONTEXT ---
import { AuthProvider } from "./context/AuthContext"; 

// IMPORT KOMPONEN
import Navbar from "./components/Navbar";

// IMPORT HALAMAN USER
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; 

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminMenu from "./pages/Admin/AdminMenu";
import AdminTransactions from "./pages/Admin/AdminTransactions";
import AdminReviews from "./pages/admin/AdminReviews";

// --- KOMPONEN LAYOUT USER ---
const UserLayout = ({ cartCount }) => {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="pt-0"> 
        <Outlet />
      </div>
    </>
  );
};

function App() {
  const [cart, setCart] = useState({});

  const handleAddToCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1, 
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1; 
      } else {
        delete newCart[productId]; 
      }
      return newCart;
    });
  };

  // --- PERUBAHAN BARU 1: FUNGSI KOSONGKAN KERANJANG ---
  const handleClearCart = () => {
    setCart({});
  };
  
  const totalItems = Object.values(cart).reduce((acc, curr) => acc + curr, 0);

  return (
    <BrowserRouter>
      <AuthProvider> 
        <Routes>
          
          {/* === KELOMPOK 1: HALAMAN USER === */}
          <Route element={<UserLayout cartCount={totalItems} />}>
            <Route 
              path="/" 
              element={
                <Home 
                  cart={cart} 
                  addToCart={handleAddToCart} 
                  removeFromCart={handleRemoveFromCart}
                />
              } 
            />
            
            <Route 
              path="/menu" 
              element={
                <Menu 
                  cart={cart} 
                  addToCart={handleAddToCart} 
                  removeFromCart={handleRemoveFromCart} 
                />
              } 
            />
            
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cart={cart} 
                  addToCart={handleAddToCart} 
                  removeFromCart={handleRemoveFromCart} 
                />
              } 
            />

            {/* --- PERUBAHAN BARU 2: OPER FUNGSI clearCart KE CHECKOUT --- */}
            <Route 
              path="/checkout" 
              element={<Checkout cart={cart} clearCart={handleClearCart} />} 
            />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />

          </Route>


          {/* === KELOMPOK 2: HALAMAN ADMIN === */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminMenu />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;