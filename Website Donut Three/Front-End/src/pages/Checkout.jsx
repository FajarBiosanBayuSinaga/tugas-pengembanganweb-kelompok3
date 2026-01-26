import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Data Produk (Pastikan ID dan Harga sesuai database/backend)
const productsData = [
  { id: 1, name: "Choco Bomb", price: 12000 },
  { id: 2, name: "Strawberry Bliss", price: 10000 },
  { id: 3, name: "Classic Glazed", price: 8000 },
  { id: 4, name: "Matcha Lover", price: 13000 },
  { id: 5, name: "Cheese Delight", price: 11000 },
  { id: 6, name: "Tiramisu", price: 14000 },
];

export default function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // --- STATE MODAL & PEMBAYARAN ---
  const [showMapModal, setShowMapModal] = useState(false);
  
  // 1. STATE BARU UNTUK SUCCESS MODAL
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [pinLocation, setPinLocation] = useState({ x: 50, y: 50 }); 
  const [mapConfirmed, setMapConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("QRIS"); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    mapAddress: "",
    detailAddress: "",
  });

  // Auto-fill form
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.username || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  // Logika Hitung Belanjaan
  const cartItems = productsData.filter((product) => cart[product.id] > 0);
  const subTotal = cartItems.reduce((total, item) => total + item.price * cart[item.id], 0);
  const shippingCost = 12000;
  const grandTotal = subTotal + shippingCost;

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- LOGIKA PETA ---
  const handleMapClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinLocation({ x, y });
  };

  const confirmLocation = () => {
    setMapConfirmed(true);
    setFormData(prev => ({...prev, mapAddress: `Lokasi Pin: Koordinat ${pinLocation.x.toFixed(1)}, ${pinLocation.y.toFixed(1)}`}));
    setShowMapModal(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening berhasil disalin!");
  };

  // --- SUBMIT ORDER ---
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) return alert("Keranjang kosong!");
    if (!user) return navigate("/login");
    if (!mapConfirmed) return alert("Mohon pilih lokasi pengiriman di peta terlebih dahulu.");

    setLoading(true);

    const itemsString = cartItems
        .map((item) => `${cart[item.id]}x ${item.name}`)
        .join(", ");

    const finalItemsString = `${itemsString} | Metode: ${paymentMethod}`;

    const orderData = {
        userId: user.id,
        username: formData.fullName,
        total: grandTotal,
        items: finalItemsString 
    };

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            // 2. JIKA SUKSES, BERSIHKAN CART & TAMPILKAN MODAL
            if (clearCart) clearCart(); 
            setShowSuccessModal(true); // Tampilkan Pop Up Sukses
        } else {
            alert("Gagal membuat pesanan.");
        }
    } catch (error) {
        console.error("Error checkout:", error);
    } finally {
        setLoading(false);
    }
  };

  // Fungsi navigasi setelah sukses
  const handleFinish = () => {
    setShowSuccessModal(false);
    navigate("/profile");
  };

  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Keranjang Kosong</h2>
        <Link to="/menu" className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold">Belanja Dulu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 py-10 pb-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-black mb-8 text-gray-900">Checkout Pesanan</h1>

        <form onSubmit={handlePayment} className="flex flex-col lg:flex-row gap-10">
          
          {/* --- KOLOM KIRI --- */}
          <div className="flex-1 space-y-6">
            
            {/* 1. INFORMASI PEMESAN */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Informasi Pemesan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Nama Lengkap" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Nomor HP</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ALAMAT & PETA */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Alamat Pengiriman</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Pilih Titik Lokasi</label>
                
                <div 
                    onClick={() => setShowMapModal(true)}
                    className={`h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden group ${mapConfirmed ? "border-green-500 bg-green-50" : "border-orange-300 bg-orange-50 hover:bg-orange-100"}`}
                >
                    {mapConfirmed ? (
                        <>
                            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/Neighborhood_Map_1002.jpg")'}}></div>
                            <span className="text-4xl z-10">📍</span>
                            <span className="font-bold text-green-700 z-10 mt-2">Lokasi Terkunci!</span>
                            <p className="text-xs text-green-600 z-10">(Klik untuk ubah)</p>
                        </>
                    ) : (
                        <>
                           <span className="text-3xl mb-1 text-orange-400 group-hover:scale-110 transition">🗺️</span>
                           <span className="font-semibold text-sm text-orange-600">Klik untuk Pilih Lokasi di Peta</span>
                        </>
                    )}
                </div>
                <input required value={formData.mapAddress} onChange={()=>{}} className="opacity-0 h-1 absolute" onInvalid={(e) => e.target.setCustomValidity('Silakan pilih lokasi di peta')} onInput={(e) => e.target.setCustomValidity('')} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Detail Alamat (Nomor Rumah/Patokan)</label>
                <textarea required rows="2" name="detailAddress" value={formData.detailAddress} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Contoh: Pagar hitam, samping warung makan..."></textarea>
              </div>
            </div>

            {/* 3. METODE PEMBAYARAN */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Pembayaran</h3>
                
                <div className="space-y-3">
                    {/* Opsi QRIS */}
                    <div 
                        onClick={() => setPaymentMethod("QRIS")}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition ${paymentMethod === "QRIS" ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-gray-200"}`}
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {paymentMethod === "QRIS" && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800">QRIS (Scan Barcode)</h4>
                            <p className="text-xs text-gray-500">Ovo, GoPay, Dana, ShopeePay</p>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS" className="h-6" />
                    </div>

                    {/* TAMPILAN JIKA PILIH QRIS */}
                    {paymentMethod === "QRIS" && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center animate-fade-in">
                            <p className="text-sm font-bold text-gray-600 mb-3">Scan QR Code di bawah ini:</p>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DonutThreePayment-${grandTotal}`} 
                                    alt="QR Code" 
                                    className="w-48 h-48"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Total Bayar: <span className="font-bold text-orange-600">{formatRupiah(grandTotal)}</span></p>
                        </div>
                    )}

                    {/* Opsi Mandiri */}
                    <div 
                        onClick={() => setPaymentMethod("MANDIRI")}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition ${paymentMethod === "MANDIRI" ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {paymentMethod === "MANDIRI" && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800">Transfer Bank Mandiri</h4>
                            <p className="text-xs text-gray-500">Cek manual</p>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.png" alt="Mandiri" className="h-6" />
                    </div>

                    {/* TAMPILAN JIKA PILIH MANDIRI */}
                    {paymentMethod === "MANDIRI" && (
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 animate-fade-in">
                            <p className="text-sm text-gray-600 mb-1">Nomor Rekening Mandiri:</p>
                            <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-200">
                                <span className="font-mono text-xl font-bold text-gray-800 tracking-widest">1050020607242</span>
                                <button 
                                    type="button" 
                                    onClick={() => copyToClipboard("1050020607242")}
                                    className="ml-auto text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md font-bold hover:bg-blue-200"
                                >
                                    SALIN
                                </button>
                            </div>
                            <p className="text-xs text-blue-600 mt-2 italic">*Mohon transfer sesuai nominal: <b>{formatRupiah(grandTotal)}</b></p>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: RINGKASAN --- */}
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Ringkasan Belanja</h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div>
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-gray-500 text-xs">{cart[item.id]} x {formatRupiah(item.price)}</div>
                    </div>
                    <div className="font-semibold text-gray-700">{formatRupiah(item.price * cart[item.id])}</div>
                  </div>
                ))}
              </div>

              <hr className="border-dashed border-gray-300 my-4" />
              
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between text-gray-600"><span>Total Harga</span><span className="font-bold">{formatRupiah(subTotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Ongkos Kirim</span><span className="font-bold">{formatRupiah(shippingCost)}</span></div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>Metode Bayar</span>
                    <span className="font-bold text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t">
                <span className="font-bold text-lg text-gray-900">Total Tagihan</span>
                <span className="font-black text-xl text-orange-600">{formatRupiah(grandTotal)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}`}
              >
                {loading ? "Memproses..." : `Bayar via ${paymentMethod} →`}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* --- MODAL PETA (POPUP) --- */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Tentukan Titik Pengiriman</h3>
                    <button onClick={() => setShowMapModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                
                <div className="relative w-full h-80 bg-gray-200 cursor-crosshair overflow-hidden group" onClick={handleMapClick}>
                    <img 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.0287665246725!2d98.61863507584742!3d3.580792650352526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312e5a5572e9c7%3A0x633f8f173742f534!2sUniversitas%20Satya%20Terra%20Bhinneka!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                        alt="Map" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500" 
                    />
                    <div 
                        className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300"
                        style={{ left: `${pinLocation.x}%`, top: `${pinLocation.y}%` }}
                    >
                        <div className="text-4xl drop-shadow-lg filter">📍</div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow text-gray-600">
                        Klik di mana saja pada peta
                    </div>
                </div>

                <div className="p-5 flex justify-end gap-3 bg-white">
                    <button onClick={() => setShowMapModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold">Batal</button>
                    <button onClick={confirmLocation} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 shadow-lg">
                        Konfirmasi Lokasi Ini
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- 4. SUCCESS MODAL (POP-UP SETELAH CHECKOUT) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 text-center">
            
            {/* Icon Sukses */}
            <div className="bg-green-50 p-8 flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-inner animate-bounce">
                <span className="text-5xl">🎉</span>
              </div>
            </div>

            {/* Konten Text */}
            <div className="p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Yeay! Pesanan Berhasil</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Terima kasih telah berbelanja! Donut lezatmu sedang diproses oleh dapur kami.
              </p>

              {/* Tombol ke Profile */}
              <button 
                onClick={handleFinish}
                className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Lihat Pesanan Saya ➝
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}