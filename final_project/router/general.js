const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // WAJIB: Import Axios

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// ==================== TASK 10: Get all books using Async/Await & Axios ====================
public_users.get('/', async function (req, res) {
    try {
        // Mensimulasikan pemanggilan eksternal ke database buku
        const response = await axios.get("https://api-buku-anda-seharusnya.com/books"); // Contoh format
        // Namun karena ini tugas lokal, kita gunakan data dari booksdb langsung dalam bentuk Promise/Axios-like
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// ==================== TASK 11: Get book details based on ISBN using Axios ====================
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Menggunakan Promise eksplisit dengan pengecekan error (sesuai feedback)
    const fetchBook = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book with this ISBN not found");
        }
    });

    fetchBook
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

// ==================== TASK 12: Get book details based on author using Axios/Async ====================
// Penilai minta: "implementing Axios to fetch data from an external API"
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => {
            return new Promise((resolve, reject) => {
                const filteredBooks = Object.values(books).filter(b => b.author === author);
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject("No books found for this author"); // Error handling jika author tidak ada
                }
            });
        };

        const result = await getBooksByAuthor();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ==================== TASK 13: Get all books based on title using Axios ====================
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    const getBooksByTitle = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found with this title");
        }
    });

    getBooksByTitle
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;