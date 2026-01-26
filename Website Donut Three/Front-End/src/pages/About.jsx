import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  // --- 1. SETUP STATE UNTUK REVIEW ---
  const [reviews, setReviews] = useState([]);

  // --- 2. AMBIL DATA DARI BACKEND ---
  useEffect(() => {
    fetch('http://localhost:5000/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Gagal mengambil data review:", err));
  }, []);

  return (
    <div className="bg-white font-sans text-gray-800">
      
      {/* --- HERO SECTION (Tidak Berubah) --- */}
      <div className="relative py-24 px-6 bg-orange-50/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold tracking-wider uppercase text-xs mb-4">
              Tentang Donut Three
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Mengukir <span className="text-orange-600 relative">
                Kebahagiaan
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> <br/>
              Dalam Setiap Gigitan.
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
              Kami percaya donut bukan sekadar makanan penutup, tapi sebuah cara untuk berbagi senyuman. Dibuat dengan cinta, disajikan dengan sukacita.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/menu" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-lg hover:shadow-orange-200 hover:-translate-y-1">
                Cek Menu
              </Link>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg">
            <div className="relative">
                <div className="absolute inset-0 bg-orange-600 rounded-[2rem] rotate-6 opacity-20 transform scale-105"></div>
                <img 
                  src="https://images.unsplash.com/photo-1516919549054-e08258825f80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Baker making donuts" 
                  className="relative rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition duration-700 border-8 border-white w-full object-cover h-96"
                />
            </div>
          </div>
        </div>
      </div>

      {/* --- OUR STORY (Tidak Berubah) --- */}
      <div className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4 relative">
                <div className="absolute -inset-4 bg-orange-100 rounded-3xl -z-10 transform -rotate-2"></div>
                <img 
                  src="https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?auto=format&fit=crop&w=400&q=80"
                  className="rounded-2xl shadow-lg mt-8 w-full h-64 object-cover hover:scale-105 transition duration-500" 
                  alt="Kitchen Process" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1551106652-a5bcf4b29e57?auto=format&fit=crop&w=400&q=80" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover hover:scale-105 transition duration-500" 
                  alt="Fresh Donuts" 
                />
             </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-900">Berawal dari Dapur Kecil</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  <strong className="text-orange-600">Donut Three</strong> lahir pada tahun 2024, di tengah keinginan sederhana untuk membuat camilan sore yang sempurna bagi keluarga.
                </p>
                <p>
                   Apa yang dimulai sebagai hobi di dapur mungil berukuran 3x3 meter, kini berkembang menjadi passion untuk menyajikan donut artisan terbaik di kota.
                </p>
                <p>
                  Kami menolak jalan pintas. Kami bangun pagi buta setiap hari untuk mengulen adonan fresh, memastikan tekstur yang <em className="italic text-gray-800">fluffy</em> dan <em className="italic text-gray-800">chewy</em> yang menjadi ciri khas kami.
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* --- BAGIAN BARU: ULASAN PELANGGAN (DARI DATABASE) --- */}
      {/* ============================================================ */}
      <div className="py-24 px-6 bg-orange-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Testimoni</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">Kata Mereka Tentang Kami</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Ulasan jujur dari pelanggan yang telah merasakan kelembutan Donut Three.
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Kita ambil maksimal 6 review terbaru agar layout tetap rapi */}
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100 flex flex-col relative">
                  {/* Hiasan Tanda Kutip */}
                  <div className="text-6xl text-orange-200 font-serif absolute top-4 right-6 opacity-50">”</div>
                  
                  <p className="text-gray-600 mb-6 italic relative z-10 leading-relaxed min-h-[80px]">
                    "{review.message}"
                  </p>
                  
                  <div className="mt-auto flex items-center gap-4 border-t pt-4 border-gray-50">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                      <p className="text-xs text-gray-400">Verified Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             // TAMPILAN JIKA BELUM ADA REVIEW
             <div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">Belum ada ulasan yang ditampilkan.</p>
                <Link to="/contact" className="text-orange-600 font-bold hover:underline">
                  Jadilah yang pertama memberi ulasan di halaman Kontak →
                </Link>
             </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/contact" className="inline-block px-8 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition">
               Tulis Pengalamanmu
            </Link>
          </div>
        </div>
      </div>
      {/* ============================================================ */}


      {/* --- VALUE PROPOSITION (Tidak Berubah) --- */}
      <div className="bg-gray-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">Kenapa Memilih <span className="text-orange-500">Donut Three?</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 border border-gray-700 hover:border-orange-500 group">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition">🌾</div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400">Bahan Premium</h3>
              <p className="text-gray-400 leading-relaxed">Kami hanya menggunakan tepung protein tinggi terbaik, mentega asli, dan coklat impor.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 border border-orange-500/50 shadow-orange-500/20 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-orange-500 w-16 h-16 rounded-bl-full opacity-20 group-hover:opacity-100 transition"></div>
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition">🔥</div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400">Made Fresh Daily</h3>
              <p className="text-gray-400 leading-relaxed">Tidak ada donut sisa kemarin. Semua dibuat pagi hari dan habis hari itu juga.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 border border-gray-700 hover:border-orange-500 group">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition">💖</div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400">Tanpa Pengawet</h3>
              <p className="text-gray-400 leading-relaxed">Aman untuk si kecil dan seluruh keluarga. Murni kenikmatan, tanpa bahan kimia aneh.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION (Tidak Berubah) --- */}
      <div className="py-20 bg-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center text-white">
          <div className="p-4">
            <div className="text-5xl font-black mb-2">20+</div>
            <div className="text-orange-200 text-sm font-bold uppercase tracking-widest">Varian Rasa</div>
          </div>
          <div className="p-4">
            <div className="text-5xl font-black mb-2">10k+</div>
            <div className="text-orange-200 text-sm font-bold uppercase tracking-widest">Terjual</div>
          </div>
          <div className="p-4">
            <div className="text-5xl font-black mb-2">4.9</div>
            <div className="text-orange-200 text-sm font-bold uppercase tracking-widest">Rating</div>
          </div>
          <div className="p-4">
            <div className="text-5xl font-black mb-2">100%</div>
            <div className="text-orange-200 text-sm font-bold uppercase tracking-widest">Halal</div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM CTA (Tidak Berubah) --- */}
      <div className="py-24 px-6 text-center bg-white">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Sudah Siap Mencoba?</h2>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
          Jangan biarkan harimu berlalu tanpa yang manis-manis. Pesan sekarang dan rasakan perbedaannya.
        </p>
        <Link 
          to="/menu" 
          className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white text-lg font-bold px-12 py-5 rounded-full shadow-xl hover:bg-orange-700 hover:scale-105 transition transform"
        >
          Pesan Donut Sekarang <span>→</span>
        </Link>
      </div>

    </div>
  );
}