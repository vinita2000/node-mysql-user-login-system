const express = require("express");
const router = express.Router();

//initally render home page
router.get("/", (req, res)=>{
    res.render("index");
});

///render register page
router.get("/register", (req, res)=>{
    res.render("register");
});

//render login page
router.get("/login", (req, res)=>{
    res.render("login");
});

//render view profile page
router.get("/profile", (req, res)=>{
    res.render("profile");
});


module.exports = router;