const express = require("express");
const router = express.Router();
const { validateQRCode } = require("../controllers/qrController");
const { protect, staff } = require("../middleware/authMiddleware");

router.post("/validate", protect, staff, validateQRCode);

module.exports = router;
