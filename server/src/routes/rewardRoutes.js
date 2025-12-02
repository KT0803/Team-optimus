const express = require("express");
const router = express.Router();
const { getRewardHistory, redeemPoints } = require("../controllers/rewardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getRewardHistory);
router.post("/redeem", protect, redeemPoints);

module.exports = router;
