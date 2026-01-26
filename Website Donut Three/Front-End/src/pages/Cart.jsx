import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart({ cart, addToCart, removeFromCart }) {
  const navigate = useNavigate();
  
  // 1. STATE UNTUK MENAMPUNG PRODUK DARI DATABASE
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. FETCH DATA PRODUK (Supaya sinkron dengan Menu)
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal load cart data:", err);
        setLoading(false);
      });
  }, []);

  // 3. FILTER PRODUK YANG ADA DI CART
  // Kita mencocokkan ID produk dari database dengan ID yang tersimpan di state 'cart'
  const cartItems = products.filter((product) => cart[product.id] > 0);

  // 4. HITUNG TOTAL HARGA
  const grandTotal = cartItems.reduce((total, item) => {
    return total + item.price * cart[item.id];
  }, 0);

  // 5. HITUNG TOTAL BARANG
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/checkout");
    } else {
      alert("Silakan Login terlebih dahulu untuk menyelesaikan pesanan.");
      navigate("/login");
    }
  };

  // TAMPILAN LOADING JIKA DATA BELUM SIAP
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 font-bold animate-pulse">Memuat Keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-8 text-gray-900">Keranjang Belanja</h1>

        {cartItems.length === 0 ? (
          // --- TAMPILAN KOSONG ---
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-12 shadow-sm text-center border border-gray-100">
            <div className="text-6xl mb-4">🍩</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Keranjang Kosong</h2>
            <Link
              to="/menu"
              className="mt-4 px-8 py-3 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:bg-orange-600 transition"
            >
              Belanja Dulu Yuk →
            </Link>
          </div>
        ) : (
          // --- TAMPILAN ADA ISI ---
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* --- LIST BARANG --- */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => {
                const qty = cart[item.id];
                // Handle perbedaan nama kolom gambar (img di DB vs image di frontend lama)
                const displayImg = item.img || item.image; 

                return (
                  <div key={item.id} className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    {/* Gambar */}
                    <img src={displayImg} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{formatRupiah(item.price)}</p>
                    </div>

                    {/* TOMBOL + / - */}
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-10">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-full flex items-center justify-center font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-l-lg transition"
                      >
                        -
                      </button>
                      
                      <span className="w-8 text-center font-bold text-gray-800 text-sm">
                        {qty}
                      </span>
                      
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-8 h-full flex items-center justify-center font-bold text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-r-lg transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- RINGKASAN PEMBAYARAN --- */}
            <div className="lg:w-96">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Rincian Pembayaran</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Total Barang</span>
                    <span className="font-bold">{totalQty} pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Harga</span>
                    <span className="font-bold">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>Total Bayar</span>
                    <span className="text-orange-600">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                {/* TOMBOL AKSI */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gray-900 text-white font-bold text-center rounded-xl shadow hover:bg-gray-800 transition"
                  >
                    Beli Sekarang
                  </button>
                  
                  <Link
                    to="/menu"
                    className="w-full py-3 bg-white text-gray-600 font-bold text-center rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                  >
                    Lanjut Belanja
                  </Link>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}