const { prisma } = require("../config/db");

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const updatedNotification = await prisma.notification.update({
            where: { id: parseInt(req.params.id) },
            data: { isRead: true }
        });

        res.json(updatedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to create notification (internal use)
const createNotification = async (userId, title, message) => {
    try {
        await prisma.notification.create({
            data: {
                userId,
                title,
                message
            }
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    createNotification
};
