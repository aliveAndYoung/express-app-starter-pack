const express = require("express");
const {
    register,
    login,
    getMe,
} = require("../controllers/authenticationController.js");
const { protect } = require("../middlewares/authentication.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
