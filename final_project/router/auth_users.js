const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Simpan user terdaftar
let users = [];

// Fungsi untuk memvalidasi username (tidak kosong)
const isValid = (username) => {
    return username && username.trim().length > 0;
}

// Fungsi untuk mengecek apakah username & password cocok
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Login sebagai pengguna terdaftar (Task 7)
regd_users.post("/customer/login", (req, res) => {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Cek kredensial
    if (authenticatedUser(username, password)) {
        // Buat token JWT untuk sesi
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});


// Tambah/Update book review (hanya user terdaftar)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username, review } = req.body;

    if (!username || !review) {
        return res.status(400).json({ message: "Username and review are required" });
    }

    if (!authenticatedUser(username, users.find(u => u.username === username)?.password)) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `Review for book ${isbn} added/updated successfully` });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;