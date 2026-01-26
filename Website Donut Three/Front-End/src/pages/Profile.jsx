import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  // --- DATA USER ---
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userProfile = {
      id: storedUser.id || 1,
      name: storedUser.username || storedUser.name || "Nama Pengguna",
      email: storedUser.email || "user@email.com",
      phone: storedUser.phone || "0812-XXXX-XXXX", 
      img: storedUser.image || storedUser.img || "https://ui-avatars.com/api/?name=User&background=random" 
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/orders/user/${userProfile.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // --- FUNGSI UTAMA: TERIMA PESANAN ---
  const handleCompleteOrder = async (orderId) => {
      const result = await Swal.fire({
          title: 'Pesanan Diterima?',
          text: "Barang akan dipindahkan ke Riwayat Pesanan.",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Ya, Terima!',
          cancelButtonText: 'Batal',
          confirmButtonColor: '#16a34a',
          cancelButtonColor: '#d33'
      });

      if (result.isConfirmed) {
          try {
              // 1. UPDATE STATUS DI DATABASE KE 'completed'
              const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'completed' }) 
              });

              if (res.ok) {
                  // 2. REFRESH DATA (PENTING!)
                  // Ini akan memicu ulang filter active/history di bawah
                  fetchOrders(); 
                  
                  // 3. PINDAHKAN TAB KE RIWAYAT
                  setActiveTab("history");

                  // 4. Notifikasi Sukses
                  Swal.fire({
                      icon: 'success',
                      title: 'Selesai!',
                      text: 'Status pesanan berhasil diperbarui.',
                      timer: 2000,
                      showConfirmButton: false
                  });
              } else {
                  Swal.fire('Gagal', 'Terjadi kesalahan saat update status.', 'error');
              }
          } catch (error) {
              console.error(error);
              Swal.fire('Error', 'Gagal menghubungi server', 'error');
          }
      }
  };

  // --- LOGIKA FILTER PEMINDAHAN (Sangat Penting) ---
  // Status 'completed' HARUS tidak ada di sini
  const activeOrders = orders.filter(o => ['pending', 'process', 'shipped'].includes(o.status));
  
  // Status 'completed' HARUS ada di sini
  const historyOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));
  
  const displayData = activeTab === "active" ? activeOrders : historyOrders;

  // Helper Badge
  const getStatusBadge = (status) => {
      const styles = {
          pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          process: "bg-blue-100 text-blue-700 border-blue-200",
          shipped: "bg-purple-100 text-purple-700 border-purple-200",
          completed: "bg-green-100 text-green-700 border-green-200",
          cancelled: "bg-red-100 text-red-700 border-red-200",
      };
      const labels = {
          pending: "Menunggu Konfirmasi",
          process: "Sedang Dibuat",
          shipped: "Sedang Dikirim",
          completed: "Selesai",
          cancelled: "Dibatalkan"
      };
      return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100"}`}>
              {labels[status] || status}
          </span>
      );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-6">Akun & Pesanan</h1>

      {/* KARTU PROFIL */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-50 shadow-md">
                  <img src={userProfile.img} alt="Profile" className="w-full h-full object-cover" onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${userProfile.name}&background=random`} />
              </div>
          </div>
          <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 justify-center md:justify-start text-sm text-gray-500">
                  <div className="flex items-center gap-2"><span className="bg-gray-100 p-1.5 rounded-full">📧</span> {userProfile.email}</div>
                  <div className="flex items-center gap-2"><span className="bg-gray-100 p-1.5 rounded-full">📞</span> {userProfile.phone}</div>
              </div>
          </div>
      </div>

      {/* TABS BUTTONS */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`pb-3 px-4 font-bold text-sm transition ${activeTab === "active" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            Sedang Berjalan ({activeOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")} 
            className={`pb-3 px-4 font-bold text-sm transition ${activeTab === "history" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            Riwayat Pesanan ({historyOrders.length})
          </button>
      </div>

      {/* LIST PESANAN */}
      {loading ? (
          <div className="text-center py-20 text-gray-500">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
             Memuat data...
          </div>
      ) : displayData.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-gray-500">Tidak ada pesanan di tab ini.</p>
          </div>
      ) : (
          <div className="space-y-4">
              {displayData.map((order) => (
                  <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                      
                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                              {getStatusBadge(order.status)}
                              <span className="text-xs text-gray-400">#{order.id}</span>
                          </div>
                          <p className="text-gray-800 font-medium line-clamp-1">{order.items}</p>
                          <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.created_at).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                      </div>

                      <div className="flex flex-col items-end gap-3 min-w-max w-full md:w-auto">
                          <span className="text-lg font-black text-orange-600">
                              Rp {parseInt(order.total_price).toLocaleString("id-ID")}
                          </span>
                          
                          {/* TOMBOL KONFIRMASI (Hanya muncul jika status Shipped) */}
                          {order.status === 'shipped' && (
                              <button 
                                onClick={() => handleCompleteOrder(order.id)}
                                className="bg-green-600 text-white text-sm px-5 py-2.5 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 w-full md:w-auto flex items-center justify-center gap-2"
                              >
                                  <span>📦</span> Pesanan Diterima
                              </button>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}