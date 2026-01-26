import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- STATE UTAMA ---
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE MODAL NOTIFIKASI ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle Input Biasa
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  // --- KHUSUS HANDLE NOMOR HP (+62) ---
  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // 1. Hapus karakter selain angka
    value = value.replace(/\D/g, "");

    // 2. Cegah user mengetik '0' di awal (0812 -> 812)
    if (value.startsWith("0")) {
        value = value.substring(1);
    }
    
    // 3. Cegah user mengetik '62' di awal (62812 -> 812) karena +62 sudah otomatis
    if (value.startsWith("62")) {
        value = value.substring(2);
    }

    setFormData({ ...formData, phone: value });
    setError("");
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi Password
    if (isRegister && formData.password.length < 8) {
        setError("Password harus memiliki minimal 8 karakter!");
        setIsLoading(false); 
        return; 
    }

    const endpoint = isRegister ? "register" : "login";
    const apiUrl = `http://localhost:5000/api/${endpoint}`;

    // Payload
    let payload;
    if (isRegister) {
        payload = { 
            email: formData.email, 
            // --- GABUNGKAN +62 DISINI ---
            phone: "+62" + formData.phone, 
            username: formData.username, 
            password: formData.password 
        };
    } else {
        payload = { 
            username: formData.username, 
            password: formData.password 
        };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      if (isRegister) {
        setSuccessMessage("Akun berhasil dibuat! Silakan login sekarang.");
        setShowSuccessModal(true);
      } else {
        login(data); 
        setSuccessMessage(`Selamat datang kembali, ${data.username}!`);
        setShowSuccessModal(true);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (isRegister) {
        setIsRegister(false);
        setFormData({ email: "", phone: "", username: "", password: "" });
    } else {
      if (formData.username === "admin") {
            navigate("/admin"); // Arahkan ke Dashboard Admin
        } else {
            navigate("/"); // User biasa ke Homepage
        }
    }
  };

  return (
    <div className="min-h-screen flex bg-orange-50 relative">
      
      {/* BAGIAN KIRI: FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-white shadow-2xl z-10">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <h2 className="text-4xl font-black text-orange-600 mb-2">Donut Three.</h2>
            <p className="text-gray-500">
              {isRegister ? "Lengkapi data untuk mendaftar." : "Masuk dengan Username & Password."}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm rounded animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            
            {/* Input Register */}
            {isRegister && (
                <>
                    <div>
                        <label className="text-gray-700 text-sm font-bold mb-1 block">Email</label>
                        <input name="email" type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder="contoh@email.com" onChange={handleChange} value={formData.email} />
                    </div>

                    {/* --- INPUT NOMOR TELEPON +62 --- */}
                    <div>
                        <label className="text-gray-700 text-sm font-bold mb-1 block">No. WhatsApp / Telepon</label>
                        <div className="relative">
                            {/* Prefix Mati +62 */}
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <span className="text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">+62</span>
                            </div>
                            
                            {/* Input Field */}
                            <input 
                                name="phone" 
                                type="text" 
                                inputMode="numeric" // Supaya keyboard HP muncul angka
                                required 
                                className="w-full pl-20 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" 
                                placeholder="8123456789" // Placeholder tanpa 0
                                onChange={handlePhoneChange} 
                                value={formData.phone} 
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Contoh: 81234567890 (Tanpa angka 0 di depan)</p>
                    </div>
                    {/* ------------------------------- */}

                </>
            )}

            {/* Input Login/Umum */}
            <div>
                <label className="text-gray-700 text-sm font-bold mb-1 block">Username</label>
                <input name="username" type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder="Username Anda" onChange={handleChange} value={formData.username} />
            </div>

            <div>
                <label className="text-gray-700 text-sm font-bold mb-1 block">Password</label>
                <input name="password" type="password" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder={isRegister ? "Minimal 8 karakter" : "Password Anda"} onChange={handleChange} value={formData.password} />
                {isRegister && <p className="text-xs text-gray-400 mt-1">Min. 8 karakter (huruf/angka).</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-full shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-orange-600 transition transform hover:-translate-y-1 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Memproses..." : (isRegister ? "Daftar Akun" : "Masuk")}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(""); 
                  setFormData({ email: "", phone: "", username: "", password: "" }); 
                }}
                className="font-bold text-orange-600 hover:text-orange-500 transition"
              >
                {isRegister ? "Login di sini" : "Daftar di sini"}
              </button>
            </p>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">
              ← Kembali ke Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: GAMBAR */}
      <div className="hidden md:block w-1/2 bg-orange-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center z-10">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-md">
            {isRegister ? "Bergabunglah Bersama Kami." : "Halo, Kangen Donut?"}
          </h1>
          <p className="text-xl font-medium opacity-90">
             Nikmati kebahagiaan di setiap gigitan Donut Three.
          </p>
          <img 
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
            alt="Donut" 
            className="w-64 h-64 object-contain mt-10 drop-shadow-2xl animate-bounce-slow"
            style={{ animationDuration: '3s' }}
          />
        </div>
      </div>

      {/* --- MODAL SUKSES --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 text-center">
            <div className="bg-green-50 p-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl shadow-inner text-green-600">
                ✅
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Berhasil!</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {successMessage}
              </p>
              <button 
                onClick={handleCloseModal}
                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 hover:shadow-lg transition transform active:scale-95"
              >
                {isRegister ? "Lanjut Login" : "Mulai Pesan Donut"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}