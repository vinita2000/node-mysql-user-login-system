const express = require("express");
const authController = require('../controller/auth');
const router = express.Router();

//when page gets submitted redirect
router.post("/register", authController.register);

router.post("/login", authController.login);

router.post('/profile', authController.profile);

module.exports = router;