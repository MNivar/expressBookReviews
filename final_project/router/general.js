const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let books_array = Object.values(books);

public_users.post("/register", (req,res) => {
  //Write your code here
 const username = req.body.username;
 const password = req.body.password;
 if (username && password){
    if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } ;
    return res.status(404).json({message: "Unable to register user, missing username and or password."});
 
});

const getAllBooks = () =>{
    return new Promise ((resolve,reject) => {
        if(books){
            resolve(books);
        }
        else{
            reject("Error retrieving books");
        }
    });
};


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getAllBooks()
    .then((allbooks) => {
        res.send(JSON.stringify(allbooks,null,4));
    })
    .catch((error) =>{
        res.status(404).send(error);
    });
});



const getBooksbyISBN = (lookup_isbn) => {

    return new Promise ((resolve,reject) => {
        if (lookup_isbn ==0 || lookup_isbn > Object.keys(books).length){
            reject("Invalid ISBN");
          }

          else {
            resolve(books[lookup_isbn]);
          }


    });

};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let lookup_isbn = parseInt(req.params.isbn);

    getBooksbyISBN(lookup_isbn)
    .then((filtered_books)=>{
        return res.send(filtered_books);
    })
    .catch((error)=>{

        res.status(404).send(error);

    });

   });


// Get book details based on author


const getBooksbyAuthor = (lookup_author) => {
    return new Promise ((resolve,reject) => {

        let selected_books = [];

        books_array.forEach((book,index,array) => {
            if (lookup_author === book.author.toLowerCase()){
                selected_books.push(book);            
            }
          });

          if (selected_books.length == 0){
            reject("No matching author");
        }
      
        else {
             resolve(selected_books);
        }

    });


};
public_users.get('/author/:author',function (req, res) {
    let lookup_author = req.params.author.toLowerCase();
    getBooksbyAuthor(lookup_author)
        .then((filtered_books)=> {
            return res.send(filtered_books);

        })
        .catch((error) => {
            return res.status(404).send(error);
        });


  });


  const getBooksbyTitle = (lookup_title) =>{
    return new Promise ((resolve,reject) =>{

        let selected_books = [];

        books_array.forEach((book,index,array)=>{

            if (book.title.toLowerCase() === lookup_title ){
                selected_books.push(book);
        }})

        if (selected_books.length == 0){
            reject("No matching titles")
        }
        else {
            resolve(selected_books);
        }


    })


  }

  // Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const lookup_title = req.params.title.toLowerCase();

    getBooksbyTitle(lookup_title)
    .then((selected_books) =>{

        return res.send(selected_books);

    })
    .catch((error) => {
        res.status(404).send(error);
    })


  
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  if (isbn == 0 || isbn > Object.keys(books).length)
    return res.send("Invalid isbn");

  let selected_review = books[isbn].reviews

  if (Object.keys(selected_review).length == 0){
    res.send("There are no reviews at this time for isbn # " + isbn);
    
  };


  return res.send("Reviews for isbn #" + isbn  + selected_review);
 
  
});

module.exports.general = public_users;
