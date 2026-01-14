const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router(); // router hanya deklar sekali
let users = [];                       // array user hanya sekali

// Fungsi validasi username
const isValid = (username) => {
    return username && username.trim().length > 0;
}

// Fungsi cek username & password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Login endpoint
regd_users.post("/customer/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Tambah / update review
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
