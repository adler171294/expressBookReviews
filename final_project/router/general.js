const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// --- Tambahkan ini jika diwajibkan menggunakan axios di script luar, 
// tapi untuk route ini kita gunakan Promise internal agar lulus kriteria async ---

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

// ==================== TASK 10 ====================
// Get the book list using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error retrieving books"});
    }
});

// ==================== TASK 11 ====================
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// ==================== TASK 12 ====================
// Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getByAuthor = new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(b => b.author === author);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found for this author");
            }
        });

        const result = await getByAuthor;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ==================== TASK 13 ====================
// Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        const result = Object.values(books).filter(b => b.title === title);
        if (result.length > 0) {
            resolve(result);
        } else {
            reject("No books found with this title");
        }
    })
    .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;