const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];
let books_array = Object.values(books);



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

if(users.find(user => user.username === username)) {
    return true;
}
else{
     return false};

};

const authenticatedUser = (username,password)=>{ //returns boolean

    if (users.find(user => user.username === username && user.password === password)){
        return true;
    }

    else {
        return false;
    }

};

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;


    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
      
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 * 60});
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    let selected_isbn = parseInt(req.params.isbn);
    let review_sub = req.body.review
    let username = req.session.authorization.username;

    books[selected_isbn].reviews[username] = review_sub;

    return res.send("Reviews for isbn #" + selected_isbn + "\n" + JSON.stringify(books[selected_isbn],null,2));

});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    let selected_isbn = parseInt(req.params.isbn);
    let username = req.session.authorization.username;

    if (!books[selected_isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    delete books[selected_isbn].reviews[username];

   // return res.send("testing");
     return res.send("You have deleted your review for isbn #" + selected_isbn + "\n" + JSON.stringify(books[selected_isbn],null,2));

});








module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
