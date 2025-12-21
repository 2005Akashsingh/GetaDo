const express = require("express");
const router = express.Router();
const { doctorSignup } = require("../controllers/doctorAuthController");

router.post("/signup", doctorSignup);

module.exports = router;
