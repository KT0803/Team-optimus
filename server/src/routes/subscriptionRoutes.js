const express = require("express");
const router = express.Router();
const {
    createSubscription,
    getMySubscriptions,
    getAllSubscriptions,
} = require("../controllers/subscriptionController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createSubscription).get(protect, admin, getAllSubscriptions);
router.route("/my").get(protect, getMySubscriptions);

module.exports = router;
