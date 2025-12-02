const express = require("express");
const router = express.Router();
const {
    getMenuItems,
    getMenuItemById,
    getOutlets,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require("../controllers/menuController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getMenuItems).post(protect, admin, createMenuItem);
router.get("/outlets", getOutlets);
router
    .route("/:id")
    .get(getMenuItemById)
    .put(protect, admin, updateMenuItem)
    .delete(protect, admin, deleteMenuItem);

module.exports = router;
