import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

export default function Home({ cart, addToCart, removeFromCart }) {
  // --- STATE DATA & LOADING ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL LOGIN ---
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { user } = useAuth(); 
  const navigate = useNavigate();

  // --- FETCH DATA ---
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal koneksi ke Backend:", error);
        setLoading(false);
      });
  }, []);

  // --- FUNGSI PROTEKSI ---
  const handleAddToCartProtected = (productId) => {
    if (!user) {
      setShowLoginModal(true); 
    } else {
      addToCart(productId);    
    }
  };

  // --- LOGIKA HITUNG KERANJANG (BARU DITAMBAHKAN) ---
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const totalPrice = Object.keys(cart).reduce((total, id) => {
      const item = products.find((p) => p.id === parseInt(id));
      return total + (item ? item.price * cart[id] : 0);
  }, 0);

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  return (
    <div className="font-sans text-gray-800 antialiased overflow-x-hidden bg-orange-50/50 relative min-h-screen pb-20"> 
      {/* Note: pb-20 ditambahkan agar konten paling bawah tidak tertutup tombol keranjang */}
      
      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-white z-0"></div>
         <div className="absolute top-0 right-0 w-2/3 h-full bg-orange-200 rounded-l-full opacity-20 transform translate-x-1/4"></div>

         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
            <div className="space-y-6 animate-fade-in-up">
              <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-sm font-bold tracking-wide uppercase">Terbaru di Kota Medan</span>
              <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900">
                Rasakan Manisnya <br /> <span className="text-orange-600">Donut Three.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                Bukan sekadar donat biasa. Donut Three menghadirkan perpaduan rasa klasik dan modern yang sempurna di setiap gigitan.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/menu" className="bg-orange-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:bg-orange-700 transition transform hover:-translate-y-1">Pesan Sekarang</Link>
                <Link to="/about" className="px-8 py-4 rounded-full font-bold text-orange-600 border-2 border-orange-100 hover:border-orange-600 transition">Tentang Kami</Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Donut Three Hero" 
                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]" 
              />
            </div>
         </div>
      </header>

      {/* --- BEST SELLER SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Favorit di Donut Three</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Dipanggang (atau digoreng) dengan cinta setiap pagi. Berikut adalah menu andalan kami hari ini.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">Mengambil data dari dapur...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.length > 0 ? (
                products.slice(0, 3).map((item) => (
                  <ProductCard 
                    key={item.id}
                    data={item}
                    qty={cart ? cart[item.id] || 0 : 0} 
                    addToCart={handleAddToCartProtected} 
                    removeFromCart={removeFromCart}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">Belum ada produk di database.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
             <Link to="/menu" className="inline-block bg-white border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-600 hover:text-white transition">
               Lihat Semua Menu ({products.length}) →
             </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-orange-500">Donut Three.</h3>
            <p className="text-gray-400 text-sm mt-2">Making life sweeter, one donut at a time.</p>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Donut Three. All rights reserved.
          </div>
        </div>
      </footer>

      {/* --- FLOATING CART BUTTON (BARU) --- */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 animate-bounce-in-up">
            <div className="max-w-7xl mx-auto">
                <Link to="/cart" className="bg-gray-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-2xl hover:bg-gray-800 hover:scale-[1.01] transition-all duration-300 border border-gray-800">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems} Item</span>
                            <span className="text-gray-400 text-xs">di keranjang</span>
                        </div>
                        <span className="font-bold text-lg mt-0.5">{formatRupiah(totalPrice)}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-orange-500">
                        Lihat Keranjang
                        <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            ➝
                        </div>
                    </div>
                </Link>
            </div>
        </div>
      )}

      {/* --- MODAL / POP-UP LOGIN --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="bg-orange-50 p-6 flex justify-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                🍩
              </div>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Login Dulu, Yuk!</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Kamu harus masuk ke akunmu untuk memesan donut lezat ini agar pesananmu tersimpan aman.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 hover:shadow-lg transition transform active:scale-95"
                >
                  Login Sekarang
                </button>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="w-full bg-white text-gray-500 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- KOMPONEN KARTU PRODUK (TIDAK BERUBAH) ---
function ProductCard({ data, qty, addToCart, removeFromCart }) {
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  const sisaStok = data.stock - qty; 
  const isHabis = sisaStok <= 0;
  const displayImage = data.img || data.image;

  return (
    <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      {!isHabis && sisaStok <= 3 && (
        <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
          Segera Habis: Sisa {sisaStok}!
        </div>
      )}
      {isHabis && (
        <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
           <span className="bg-gray-800 text-white font-bold px-6 py-2 rounded-full transform -rotate-6 shadow-xl text-lg">SOLD OUT</span>
        </div>
      )}
      <div className="h-64 overflow-hidden bg-gray-50 relative flex items-center justify-center">
        <img src={displayImage} alt={data.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">{data.name}</h3>
          <span className="text-lg font-black text-orange-600">{formatRupiah(data.price)}</span>
        </div>
        <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2">{data.description || data.desc}</p>
        <div className="mt-auto">
          {qty > 0 ? (
            <div className="flex items-center justify-between bg-orange-50 rounded-xl p-1 border border-orange-100">
              <button onClick={() => removeFromCart(data.id)} className="w-10 h-10 flex items-center justify-center bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-100 transition text-xl">-</button>
              <div className="flex flex-col items-center leading-none px-2">
                <span className="font-bold text-gray-900">{qty}</span>
                <span className="text-[10px] text-orange-600">pcs</span>
              </div>
              <button onClick={() => !isHabis && addToCart(data.id)} disabled={isHabis} className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition text-xl">+</button>
            </div>
          ) : (
            <button 
              onClick={() => !isHabis && addToCart(data.id)}
              disabled={isHabis}
              className={`w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isHabis ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-200"}`}
            >
              {isHabis ? "Stok Habis" : "Tambah ke Keranjang"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}