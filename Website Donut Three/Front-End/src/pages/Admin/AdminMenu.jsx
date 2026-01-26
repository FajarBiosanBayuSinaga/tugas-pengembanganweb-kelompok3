import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Pastikan sudah npm install sweetalert2

export default function AdminMenu() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State Form
  const [form, setForm] = useState({ id: "", name: "", price: "", stock: "", description: "", img: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  };

  // --- HANDLE SUBMIT DENGAN SWEETALERT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tampilkan loading
    Swal.fire({
        title: 'Menyimpan Data...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    const payload = {
        name: form.name,
        price: form.price,
        stock: form.stock,
        description: form.description,
        img: form.img
    };

    const url = isEditing 
      ? `http://localhost:5000/api/products/${form.id}` 
      : `http://localhost:5000/api/products`;
    
    const method = isEditing ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            setShowModal(false);
            fetchProducts(); 
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: isEditing ? 'Data menu berhasil diperbarui.' : 'Menu baru berhasil ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan data.', 'error');
        }
    } catch (error) {
        Swal.fire('Error!', 'Tidak dapat terhubung ke server.', 'error');
    }
  };

  // --- HANDLE DELETE DENGAN SWEETALERT ---
  const handleDelete = (id) => {
      Swal.fire({
          title: 'Hapus Menu?',
          text: "Data yang dihapus tidak bisa dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Ya, Hapus!',
          cancelButtonText: 'Batal'
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
                fetchProducts();
                Swal.fire(
                  'Terhapus!',
                  'Menu telah dihapus dari database.',
                  'success'
                )
              } catch (error) {
                  Swal.fire('Gagal', 'Terjadi kesalahan server.', 'error');
              }
          }
      })
  };

  const openEdit = (item) => {
      setIsEditing(true);
      setForm({
          id: item.id,
          name: item.name,
          price: item.price,
          stock: item.stock,
          description: item.description || "",
          img: item.image || item.img || ""
      });
      setShowModal(true);
  };

  const openAdd = () => {
    setIsEditing(false); 
    setForm({ name: "", price: "", stock: "", description: "", img: "" }); 
    setShowModal(true); 
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black text-gray-800">Manajemen Menu</h1>
                <p className="text-gray-500 mt-1">Atur daftar donat yang tersedia di toko.</p>
            </div>
            <button 
                onClick={openAdd}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 shadow-xl shadow-gray-200 transition transform hover:-translate-y-1"
            >
                + Tambah Donat Baru
            </button>
        </div>

        {/* TABLE DATA */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-900 text-white uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="p-5">Foto</th>
                            <th className="p-5">Informasi Produk</th>
                            <th className="p-5">Harga</th>
                            <th className="p-5">Stok</th>
                            <th className="p-5 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition duration-150 group">
                                <td className="p-5">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 relative">
                                        <img 
                                            src={item.image || item.img || "https://placehold.co/100x100?text=No+Image"} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                            onError={(e) => e.target.style.display = 'none'} 
                                        />
                                    </div>
                                </td>
                                <td className="p-5">
                                    <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{item.description || "Tidak ada deskripsi"}</p>
                                </td>
                                <td className="p-5">
                                    <span className="font-mono font-bold text-orange-600 text-lg">
                                        Rp {parseInt(item.price).toLocaleString('id-ID')}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.stock > 5 ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                        {item.stock} pcs
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100">
                                            ✏️ <span className="sr-only">Edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm border border-red-100">
                                            🗑️ <span className="sr-only">Hapus</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-500">Belum ada menu donat.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MODAL FORM */}
        {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    
                    {/* Modal Header */}
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-gray-800">{isEditing ? "Edit Menu Donat" : "Tambah Donat Baru"}</h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>
                    
                    {/* Modal Body (Scrollable) */}
                    <div className="p-8 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Section Gambar */}
                            <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                    {form.img ? (
                                        <img src={form.img} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center px-2">Preview Gambar</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Link Gambar (URL)</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://..."
                                        className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
                                        value={form.img} 
                                        onChange={e => setForm({...form, img: e.target.value})} 
                                    />
                                    <p className="text-xs text-gray-500 mt-2">*Masukkan URL gambar dari Unsplash atau sumber lainnya.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Donat</label>
                                    <input type="text" required className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Contoh: Choco Bomb" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Stok Tersedia</label>
                                    <input type="number" required className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="0" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Harga Satuan (Rp)</label>
                                <input type="number" required className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Contoh: 12000" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Produk</label>
                                <textarea className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg h-28 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Jelaskan rasa dan tekstur donat..."></textarea>
                            </div>

                            {/* Modal Footer (Actions) */}
                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition">Batal</button>
                                <button type="submit" className="flex-1 py-3 bg-gray-900 rounded-xl font-bold text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-200 transition">{isEditing ? "Simpan Perubahan" : "Tambah Menu"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}