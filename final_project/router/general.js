const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
 const username = req.body.username;
 const password = req.body.password;
 if (username && password){
    if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } ;
    return res.status(404).json({message: "Unable to register user."});
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let lookup_isbn = parseInt(req.params.isbn);
  if (lookup_isbn ==0 || lookup_isbn > Object.keys(books).length){
    return res.send("invalid isbn");
  }

  return res.send(books[lookup_isbn]); //JS index starts at 0
  ;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let lookup_author = req.params.author.toLowerCase();

  let books_array = Object.values(books);
  let selected_books = [];

  
  books_array.forEach((book,index,array) => {
    if (lookup_author === book.author.toLowerCase()){
        selected_books.push(book);
    }
  });

  if (selected_books.length == 0)
    return res.send("No matching author");

  res.send(selected_books);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  if (isbn == 0 || isbn > Object.keys(books).length)
    return res.send("Invalid isbn");

  let selected_review = books[isbn].reviews;
  return res.send(selected_review);
 
  
});

module.exports.general = public_users;
