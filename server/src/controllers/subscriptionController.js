const { prisma } = require("../config/db");
const crypto = require("crypto");

// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
    const { planType, mealType, validFrom, validTo } = req.body;

    try {
        const subscription = await prisma.subscription.create({
            data: {
                userId: req.user.id,
                planType,
                mealType,
                validFrom: new Date(validFrom),
                validTo: new Date(validTo),
                qrCode: crypto.randomBytes(16).toString("hex"),
            },
        });
        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
const getMySubscriptions = async (req, res) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            where: { userId: req.user.id },
        });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all subscriptions (Admin)
// @route   GET /api/subscriptions
// @access  Private/Admin
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubscription,
    getMySubscriptions,
    getAllSubscriptions,
};
