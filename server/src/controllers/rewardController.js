const { prisma } = require("../config/db");

// @desc    Get reward history and balance
// @route   GET /api/rewards
// @access  Private
const getRewardHistory = async (req, res) => {
    try {
        const rewards = await prisma.reward.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        // Get current balance from User model
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { rewardPoints: true }
        });

        res.json({
            balance: user.rewardPoints,
            history: rewards
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Redeem points
// @route   POST /api/rewards/redeem
// @access  Private
const redeemPoints = async (req, res) => {
    const { points, description } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (user.rewardPoints < points) {
            return res.status(400).json({ message: "Insufficient points" });
        }

        // Deduct points
        await prisma.$transaction([
            prisma.user.update({
                where: { id: req.user.id },
                data: { rewardPoints: { decrement: parseInt(points) } }
            }),
            prisma.reward.create({
                data: {
                    userId: req.user.id,
                    points: parseInt(points),
                    type: "REDEEMED",
                    description: description || "Redeemed for perks"
                }
            })
        ]);

        res.json({ message: "Points redeemed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRewardHistory,
    redeemPoints,
};
