import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/reviews')
        .then(res => {
            if (!res.ok) throw new Error("Gagal mengambil data");
            return res.json();
        })
        .then(data => {
            setReviews(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  };

  // Fitur Hapus Ulasan (Optional: Jika Admin ingin menghapus spam)
  const handleDelete = (id) => {
    Swal.fire({
        title: 'Hapus Ulasan?',
        text: "Pesan ini akan dihapus permanen.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:5000/api/reviews/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire('Terhapus!', 'Ulasan telah dihapus.', 'success');
                    fetchReviews();
                } else {
                    Swal.fire('Gagal', 'Gagal menghapus ulasan.', 'error');
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-800">Ulasan & Masukan</h1>
            <p className="text-gray-500 mt-1">Daftar pesan dan testimoni dari pelanggan.</p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
             <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat ulasan...</p>
             </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                        
                        {/* CARD HEADER */}
                        <div className="p-6 border-b border-gray-50 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {/* Avatar Inisial */}
                                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                    {msg.name ? msg.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight">{msg.name || "Anonim"}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{msg.email || "Tidak ada email"}</p>
                                </div>
                            </div>
                        </div>

                        {/* CARD BODY */}
                        <div className="p-6 bg-orange-50/30 flex-1">
                            <div className="relative">
                                <span className="absolute -top-2 -left-2 text-4xl text-orange-200 font-serif">“</span>
                                <p className="text-gray-700 leading-relaxed text-sm italic relative z-10 px-2">
                                    {msg.message}
                                </p>
                                <span className="absolute -bottom-4 -right-2 text-4xl text-orange-200 font-serif">”</span>
                            </div>
                        </div>

                        {/* CARD FOOTER */}
                        <div className="p-4 bg-white rounded-b-xl border-t border-gray-50 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                📅 {msg.created_at ? new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Tanpa Tanggal"}
                            </span>
                            
                            <button 
                                onClick={() => handleDelete(msg.id)}
                                className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                                title="Hapus Ulasan"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        {/* EMPTY STATE */}
        {!loading && reviews.length === 0 && (
            <div className="bg-white p-16 rounded-2xl text-center text-gray-400 shadow-sm border border-gray-100 max-w-2xl mx-auto mt-10">
                <span className="text-6xl block mb-6 grayscale opacity-50">📭</span>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Belum ada ulasan</h3>
                <p className="text-sm">Pelanggan belum mengirimkan pesan atau testimoni.</p>
            </div>
        )}

      </div>
    </div>
  );
}