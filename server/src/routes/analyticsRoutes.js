const express = require("express");
const router = express.Router();
const { getAdminAnalytics, getStudentAnalytics } = require("../controllers/analyticsController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/admin", protect, admin, getAdminAnalytics);
router.get("/student", protect, getStudentAnalytics);

module.exports = router;
