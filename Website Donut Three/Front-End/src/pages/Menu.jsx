import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";     

export default function Menu({ cart, addToCart, removeFromCart }) {
  // 1. STATE
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE BARU UNTUK POP-UP LOGIN ---
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user } = useAuth(); 
  const navigate = useNavigate(); 

  // 2. FETCH DATA
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data:", error);
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

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // --- LOGIKA HITUNG KERANJANG (ITEM & TOTAL HARGA) ---
  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // Perlu menghitung total harga untuk ditampilkan di tombol (sama seperti Home)
  const totalPrice = Object.keys(cart).reduce((total, id) => {
    const item = products.find((p) => p.id === parseInt(id));
    return total + (item ? item.price * cart[id] : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 relative">
      
      <div className="pt-8"></div> 

      {/* --- KONTEN MENU --- */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-black mb-2 text-gray-900">Menu</h2>
            <p className="text-gray-500 text-lg">Pilih donut favoritmu dan rasakan kebahagiaannya</p>
        </div>
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Mengambil menu dari dapur...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
                const qtyInCart = cart[product.id] || 0;
                const sisaStok = product.stock - qtyInCart; 
                const isOutOfStock = sisaStok <= 0;

                const displayImg = product.img || product.image; 
                const displayDesc = product.description || product.desc;
                const displayCategory = product.category || "Favorit"; 

                return (
                <div 
                    key={product.id} 
                    className={`bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col transition hover:shadow-xl group ${isOutOfStock ? 'opacity-70' : ''}`}
                >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                        <img
                            src={displayImg}
                            alt={product.name}
                            className={`w-full h-full object-cover transition duration-700 ease-in-out ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                                <span className="bg-red-600 text-white font-bold px-6 py-2 rounded-full transform -rotate-12 border-4 border-white shadow-xl text-lg">HABIS</span>
                            </div>
                        )}
                        {!isOutOfStock && sisaStok <= 5 && (
                            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-10">
                                Sisa {sisaStok} pcs!
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-orange-500 text-xs font-bold uppercase tracking-wide mb-1">{displayCategory}</p>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
                            </div>
                            <span className="text-lg font-black text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                                {formatRupiah(product.price)}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2">{displayDesc}</p>

                        <div className="mt-auto">
                            <div className="flex justify-between items-center text-sm text-gray-400 mb-4 font-medium">
                                <span>Stok Tersedia: <span className={sisaStok < 5 ? "text-red-500 font-bold" : "text-gray-800 font-bold"}>{sisaStok}</span></span>
                            </div>

                            {qtyInCart === 0 ? (
                                <button
                                    onClick={() => !isOutOfStock && handleAddToCartProtected(product.id)}
                                    disabled={isOutOfStock}
                                    className={`w-full py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-lg ${!isOutOfStock ? "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 transform active:scale-95" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
                                >
                                    {!isOutOfStock ? "Tambah ke Keranjang +" : "Stok Habis"}
                                </button>
                            ) : (
                                <div className="flex items-center justify-between bg-orange-50 rounded-xl border border-orange-200 p-1">
                                    <button onClick={() => removeFromCart(product.id)} className="w-12 h-10 flex items-center justify-center bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-100 transition active:scale-90 text-xl">-</button>
                                    <div className="flex flex-col items-center px-4">
                                        <span className="font-bold text-gray-900 text-lg">{qtyInCart}</span>
                                        <span className="text-[10px] text-orange-600 font-semibold leading-none">pcs</span>
                                    </div>
                                    <button onClick={() => !isOutOfStock && handleAddToCartProtected(product.id)} disabled={isOutOfStock} className={`w-12 h-10 flex items-center justify-center font-bold rounded-lg shadow-sm transition active:scale-90 text-xl ${!isOutOfStock ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>+</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>

      {/* --- FLOATING CART (UPDATE: DESAIN SAMA DENGAN HOME) --- */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 animate-bounce-in-up">
            <div className="max-w-7xl mx-auto">
                <Link to="/cart" className="bg-gray-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-2xl hover:bg-gray-800 hover:scale-[1.01] transition-all duration-300 border border-gray-800">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalCartItems} Item</span>
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

      {/* --- MODAL / POP-UP LOGIN (SAMA) --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            {/* Bagian Atas / Icon */}
            <div className="bg-orange-50 p-6 flex justify-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                🍩
              </div>
            </div>

            {/* Konten Text */}
            <div className="p-8 text-center">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Login Dulu, Yuk!</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Kamu harus masuk ke akunmu untuk memesan donut lezat ini agar pesananmu tersimpan aman.
              </p>

              {/* Tombol Action */}
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