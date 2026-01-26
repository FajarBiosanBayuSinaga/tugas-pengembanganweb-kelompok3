import React, { useState } from "react";

export default function Contact() {
  // --- BAGIAN LOGIKA (TETAP SAMA DENGAN SEBELUMNYA) ---
  
  // State data form (sesuai database: fullName, email, message)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  // State untuk status pengiriman
  const [status, setStatus] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    // Kirim ke Backend
    fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        setStatus("success");
        setFormData({ fullName: "", email: "", message: "" }); // Reset form
        setTimeout(() => setStatus(null), 5000); // Hilang setelah 5 detik
      } else {
        setStatus("error");
      }
    })
    .catch(err => {
      console.error(err);
      setStatus("error");
    });
  };

  // --- BAGIAN TAMPILAN (DESAIN BARU) ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20 pb-12">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-12 px-6">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Hubungi Kami</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Ada pertanyaan atau ingin memberikan ulasan? Kami siap mendengar dari Anda.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
        
        {/* KOLOM KIRI: INFO & FORM */}
        <div className="space-y-8">
          
          {/* 1. Info Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-orange-600 mb-6">Informasi Kontak</h3>
            
            <div className="space-y-4">
              {/* Alamat */}
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">📍</div>
                <div>
                  <h4 className="font-bold text-gray-900">Alamat Outlet</h4>
                  <p className="text-gray-600">
                    Universitas Satya Terra Bhinneka<br/>
                    Jl. Sunggal No.370, Sunggal, Kec. Medan Sunggal,<br/>
                    Kota Medan, Sumatera Utara 20128
                  </p>
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">📞</div>
                <div>
                  <h4 className="font-bold text-gray-900">Telepon / WhatsApp</h4>
                  <p className="text-gray-600">+62 821-7486-3850</p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">⏰</div>
                <div>
                  <h4 className="font-bold text-gray-900">Jam Operasional</h4>
                  <p className="text-gray-600">Senin - Sabtu: 09.00 - 21.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Form Pesan & Ulasan (Desain Baru + Logika Lama) */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-1">Pusat Bantuan</h3>
            <p className="text-orange-600 font-bold mb-6">Kirim Pesan & Ulasan</p>
            
            {/* Notifikasi Status (Agar user tau pesan terkirim) */}
            {status === "success" && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm font-bold text-center border border-green-200">
                    ✅ Pesan berhasil dikirim! Cek halaman About.
                </div>
            )}
            {status === "error" && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-bold text-center border border-red-200">
                    ❌ Gagal mengirim pesan. Silakan coba lagi.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="fullName" // Sesuai state logic
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nama Anda" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@contoh.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pesan / Ulasan</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tulis pesan atau pengalaman makan Anda di sini..." 
                  rows="3" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                ></textarea>
              </div>

              <p className="text-xs text-gray-500 italic mt-2 mb-4">
                * Masukan Anda akan ditampilkan di halaman "About" sebagai testimoni.
              </p>

              <button 
                type="submit" 
                disabled={status === "sending"}
                className={`w-full text-white font-bold py-3 rounded-xl transition shadow-lg transform active:scale-95
                  ${status === "sending" ? "bg-gray-400 cursor-wait" : "bg-gray-900 hover:bg-orange-600"}
                `}
              >
                {status === "sending" ? "Mengirim..." : "Kirim Sekarang"}
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: MAPS FULL HEIGHT */}
        <div className="bg-white p-2 rounded-3xl shadow-2xl h-[600px] relative overflow-hidden border-4 border-white">
          <iframe 
            title="Lokasi Universitas Satya Terra Bhinneka"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.0287665246725!2d98.61863507584742!3d3.580792650352526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312e5a5572e9c7%3A0x633f8f173742f534!2sUniversitas%20Satya%20Terra%20Bhinneka!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1.5rem' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-gray-100">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Lokasi</p>
            <p className="text-sm text-gray-800 font-bold">Universitas Satya Terra Bhinneka</p>
          </div>
        </div>

      </div>
    </div>
  );
}