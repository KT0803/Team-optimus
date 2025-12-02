const { prisma } = require("../config/db");

// @desc    Validate QR Code
// @route   POST /api/qr/validate
// @access  Private/Staff
const validateQRCode = async (req, res) => {
    const { qrCode } = req.body;

    try {
        // Check in Orders
        const order = await prisma.order.findFirst({
            where: { qrCode },
            include: { user: true, orderItems: { include: { menuItem: true } } }
        });

        if (order) {
            if (order.status === 'Completed') {
                return res.status(400).json({ message: "QR Code already used (Order Completed)" });
            }
            // Mark as completed
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'Completed' }
            });
            return res.json({ type: 'ORDER', data: order, message: "Order Verified Successfully" });
        }

        // Check in Subscriptions
        const subscription = await prisma.subscription.findFirst({
            where: { qrCode },
            include: { user: true }
        });

        if (subscription) {
            const now = new Date();
            if (now < subscription.validFrom || now > subscription.validTo) {
                return res.status(400).json({ message: "Subscription expired or not yet active" });
            }
            // For subscriptions, we might not mark it as 'used' if it's a pass, but for now let's assume it's valid
            return res.json({ type: 'SUBSCRIPTION', data: subscription, message: "Subscription Verified" });
        }

        res.status(404).json({ message: "Invalid QR Code" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { validateQRCode };
