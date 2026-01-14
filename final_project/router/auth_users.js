const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Validasi username
const isValid = (username) => {
  return username && username.trim().length > 0;
};

// Cek username & password
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// ===================== LOGIN =====================
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  // Generate JWT
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  // 🔑 SIMPAN TOKEN KE SESSION (INI YANG WAJIB)
  req.session.authorization = {
    accessToken: token,
    username: username
  };

  return res.status(200).json({
    message: "Login successful"
  });
});

// ===================== ADD / UPDATE REVIEW =====================
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Username diambil dari session (BUKAN dari body)
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({
      message: "Review is required"
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Tambah / update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for book ${isbn} added/updated successfully`
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body;

    // cukup cek username ada di array users
    if (!users.find(u => u.username === username)) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: `Review by ${username} for book ${isbn} deleted successfully`,
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
