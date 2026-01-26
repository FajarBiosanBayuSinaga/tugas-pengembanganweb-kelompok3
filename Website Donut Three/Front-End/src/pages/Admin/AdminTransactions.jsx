import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // --- UPDATE STATUS (DROPDOWN) ---
  const handleStatusChange = async (id, newStatus) => {
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            // Update tampilan lokal agar cepat (tanpa loading ulang)
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
            
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            Toast.fire({
                icon: 'success',
                title: `Status diperbarui menjadi ${newStatus}`
            });
        } else {
            Swal.fire('Gagal', 'Gagal update status', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Terjadi kesalahan koneksi', 'error');
    }
  };

  // --- HAPUS PESANAN ---
  const handleDeleteOrder = (id) => {
      Swal.fire({
          title: 'Hapus Pesanan?',
          text: "Data pesanan ini akan hilang permanen!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Ya, Hapus!',
          cancelButtonText: 'Batal'
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
                      method: 'DELETE'
                  });

                  if (res.ok) {
                      Swal.fire('Terhapus!', 'Pesanan berhasil dihapus.', 'success');
                      fetchOrders(); // Refresh data
                  } else {
                      Swal.fire('Gagal', 'Gagal menghapus data.', 'error');
                  }
              } catch (error) {
                  Swal.fire('Error', 'Terjadi kesalahan server.', 'error');
              }
          }
      });
  };

  // Helper untuk Warna Dropdown Status
  const getStatusColor = (status) => {
      switch(status) {
          case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
          case 'process': return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
          case 'completed': return 'bg-green-50 text-green-700 border-green-200';
          case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
          default: return 'bg-gray-50';
      }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black text-gray-800">Daftar Pesanan Masuk</h1>
                <p className="text-gray-500 mt-1">Pantau & ubah status pesanan pelanggan.</p>
            </div>
            <button onClick={fetchOrders} className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm font-bold text-sm">
                🔄 Refresh Data
            </button>
        </div>

        {/* TABEL PESANAN */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-900 text-white uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="p-5">ID & Waktu</th>
                            <th className="p-5">Pelanggan</th>
                            <th className="p-5 w-1/4">Detail Pesanan</th>
                            <th className="p-5">Total</th>
                            <th className="p-5">Update Status</th> {/* Dropdown disini */}
                            <th className="p-5 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                             <tr><td colSpan="6" className="p-10 text-center">Memuat data...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-500">Belum ada pesanan masuk.</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                                    
                                    {/* 1. ID & WAKTU */}
                                    <td className="p-5 align-top">
                                        <div className="font-bold text-gray-800">#{order.id}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(order.created_at).toLocaleDateString("id-ID", {
                                                day: 'numeric', month: 'short'
                                            })}
                                        </div>
                                        <div className="text-xs text-orange-600 font-mono">
                                            {new Date(order.created_at).toLocaleTimeString("id-ID", {
                                                hour: '2-digit', minute: '2-digit'
                                            })} WIB
                                        </div>
                                    </td>

                                    {/* 2. PELANGGAN */}
                                    <td className="p-5 align-top">
                                        <div className="font-bold text-gray-700">{order.username}</div>
                                        <div className="text-xs text-gray-400">ID User: {order.user_id}</div>
                                    </td>

                                    {/* 3. DETAIL PESANAN */}
                                    <td className="p-5 align-top">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                                            {order.items}
                                        </div>
                                    </td>

                                    {/* 4. TOTAL HARGA */}
                                    <td className="p-5 align-top">
                                        <span className="font-bold text-gray-900">
                                            Rp {parseInt(order.total_price).toLocaleString('id-ID')}
                                        </span>
                                    </td>

                                    {/* 5. DROPDOWN STATUS (YANG ANDA MINTA) */}
                                    <td className="p-5 align-top">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`w-full p-2.5 rounded-lg text-sm font-bold border outline-none cursor-pointer transition ${getStatusColor(order.status)}`}
                                        >
                                            <option value="pending">⏳ Menunggu</option>
                                            <option value="process">🔥 Diproses</option>
                                            <option value="shipped">🚚 Dikirim</option>
                                            <option value="completed">✅ Selesai</option>
                                            <option value="cancelled">❌ Batal</option>
                                        </select>
                                    </td>

                                    {/* 6. TOMBOL HAPUS */}
                                    <td className="p-5 align-top text-center">
                                        <button 
                                            onClick={() => handleDeleteOrder(order.id)} 
                                            className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm border border-red-100 group"
                                            title="Hapus Pesanan"
                                        >
                                            <span className="block text-lg">🗑️</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}