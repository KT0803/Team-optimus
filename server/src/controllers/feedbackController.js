const { prisma } = require("../config/db");

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    try {
        const feedback = await prisma.feedback.create({
            data: {
                userId: req.user.id,
                rating: parseInt(rating),
                comment,
            },
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
};
