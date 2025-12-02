const express = require("express");
const router = express.Router();
const {
    getWeeklyMenu,
    getCurrentWeekMenu,
    createWeeklyMenuItem,
    updateWeeklyMenuItem,
    deleteWeeklyMenuItem
} = require("../controllers/weeklyMenuController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getWeeklyMenu);
router.get("/current", getCurrentWeekMenu);

// Admin routes
router.post("/", protect, admin, createWeeklyMenuItem);
router.put("/:id", protect, admin, updateWeeklyMenuItem);
router.delete("/:id", protect, admin, deleteWeeklyMenuItem);

module.exports = router;
