require('dotenv').config()
const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");
const encrypt = require("mongoose-encryption");

const ejs = require("ejs");
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encrypedFields: ["password"],excludeFromEncryption: ["email"]});

const User = new mongoose.model("User", userSchema)

app.post("/register", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User ({
    email: username,
    password: password
  });

    newUser.save(function(err){
      if(err){
        console.log(err)
      } else {
        res.render("secrets")
      }
    });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err)
    } else {
      if (foundUser) {
        if(foundUser.password === password)
        res.render("secrets")
      }
    }
  });
});

app.get("/", function(req, res){
  res.render("home");

  console.log(process.env.SECRET);
  User.find({}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

});

app.get("/register", function(req, res){
  res.render("register")
});

app.get("/login", function(req, res){
  res.render("login")
});

app.listen(3000, function(){
  console.log("Server is live at port 3000...")
});
