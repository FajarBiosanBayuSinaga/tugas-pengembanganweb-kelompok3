const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// KONEKSI DATABASE
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'donutthree_db', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, conn) => {
    if (err) console.error("❌ Koneksi Database Gagal: " + err.message);
    else {
        console.log("✅ Database Terkoneksi!");
        conn.release();
    }
});

// ================= ROUTES (API) =================

// --- 1. AUTH: REGISTER ---
app.post('/api/register', (req, res) => {
    const { username, email, phone, password } = req.body;
    
    if (!password || password.length < 8) {
        return res.status(400).json("Password minimal harus 8 karakter!");
    }

    const checkSql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkSql, [username, email], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.length > 0) {
            if (result[0].username === username) return res.status(400).json("Username sudah dipakai!");
            if (result[0].email === email) return res.status(400).json("Email sudah terdaftar!");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const sql = "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)";
        db.query(sql, [username, email, phone, hashedPassword], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Pendaftaran Berhasil!");
        });
    });
});

// --- 2. AUTH: LOGIN ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    
    db.query(sql, [username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Username tidak ditemukan!");

        const checkPassword = bcrypt.compareSync(password, data[0].password);
        if (!checkPassword) return res.status(400).json("Password salah!");

        const { password: userPass, ...others } = data[0]; 
        res.status(200).json(others);
    });
});

// --- 3. PUBLIC: PRODUCTS ---
app.get('/api/products', (req, res) => {
    const sql = "SELECT id, nama AS name, price, stock, description, img AS image FROM products";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- 4. ADMIN: PRODUCT MANAGEMENT ---
app.post('/api/products', (req, res) => {
    const { name, price, stock, description, img } = req.body;
    const imageToSave = img || "https://placehold.co/400x400?text=Donut"; 
    const sql = "INSERT INTO products (nama, price, stock, description, img) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [name, price, stock, description, imageToSave], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Produk berhasil ditambahkan" });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, stock, description, img } = req.body;
    const sql = "UPDATE products SET nama=?, price=?, stock=?, description=?, img=? WHERE id=?";
    
    db.query(sql, [name, price, stock, description, img, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Produk berhasil diupdate" });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
        res.json({ message: "Produk berhasil dihapus!" });
    });
});

// --- 5. ORDERS MANAGEMENT ---
app.get('/api/orders', (req, res) => {
    const sql = `
        SELECT orders.*, users.username 
        FROM orders 
        JOIN users ON orders.user_id = users.id 
        ORDER BY orders.created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.json([]); 
        res.json(result);
    });
});

// 🔥 PERUBAHAN ADA DI SINI: GANTI 'app.patch' MENJADI 'app.put' 🔥
app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status: 'completed'
    
    console.log(`Menerima request update ID: ${id} ke status: ${status}`); // Debugging

    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Order ID tidak ditemukan" });
        
        res.json({ message: "Status updated" });
    });
});

app.get('/api/orders/user/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/orders', (req, res) => {
    const { userId, username, total, items } = req.body; 
    const sql = "INSERT INTO orders (user_id, username, total_price, items, status) VALUES (?, ?, ?, ?, 'pending')";
    db.query(sql, [userId, username, total, items], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Pesanan berhasil dibuat" });
    });
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM orders WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan" });
        }
        
        res.json({ message: "Pesanan berhasil dihapus" });
    });
});

// --- 6. REVIEWS & MESSAGES ---

app.get('/api/reviews', (req, res) => {
    const sql = "SELECT * FROM reviews ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/reviews', (req, res) => {
    const { fullName, name, email, message } = req.body;
    const finalName = fullName || name; 

    const sql = "INSERT INTO reviews (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [finalName, email, message], (err, result) => {
        if (err) return res.status(500).send("Gagal");
        res.send("Sukses");
    });
});

app.delete('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM reviews WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Review tidak ditemukan" });
        res.json({ message: "Review berhasil dihapus!" });
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});