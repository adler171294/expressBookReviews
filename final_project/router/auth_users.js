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

// Login sebagai pengguna terdaftar (Task 7)
regd_users.post("/customer/login", (req, res) => {
    const { username, password } = req.body;

    // Cek apakah username/password dikirim
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Cek apakah username & password cocok
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Buat token JWT untuk sesi
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
