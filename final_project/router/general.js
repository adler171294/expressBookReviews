const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get the list of all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = {};

    Object.keys(books).forEach(isbn => {
        if (books[isbn].author.toLowerCase() === author) {
            result[isbn] = books[isbn];
        }
    });

    if (Object.keys(result).length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = {};

    Object.keys(books).forEach(isbn => {
        if (books[isbn].title.toLowerCase() === title) {
            result[isbn] = books[isbn];
        }
    });

    if (Object.keys(result).length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
