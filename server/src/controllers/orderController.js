const { prisma } = require("../config/db");
const crypto = require("crypto");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, totalAmount, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: "No order items" });
        return;
    } else {
        try {
            // 1. Create Order
            const order = await prisma.order.create({
                data: {
                    userId: req.user.id,
                    totalAmount: parseFloat(totalAmount),
                    status: "Pending",
                    paymentStatus: "Paid", // Mocking successful payment
                    qrCode: crypto.randomBytes(16).toString("hex"), // Generate random QR string
                    orderItems: {
                        create: orderItems.map((item) => ({
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: {
                    orderItems: true
                }
            });

            // 2. Create Payment Record
            await prisma.payment.create({
                data: {
                    orderId: order.id,
                    amount: parseFloat(totalAmount),
                    method: paymentMethod || "UPI",
                    status: "Success"
                }
            })

            res.status(201).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                orderItems: {
                    include: { menuItem: true },
                },
            },
        });

        if (order) {
            // Check if user is admin or the order owner
            if (req.user.role === 'ADMIN' || req.user.role === 'STAFF' || order.userId === req.user.id) {
                res.json(order);
            } else {
                res.status(401).json({ message: "Not authorized to view this order" });
            }
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                orderItems: {
                    include: { menuItem: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Staff
const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { id: true, name: true },
                },
                orderItems: {
                    include: { menuItem: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Staff
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(req.params.id) },
            data: { status }
        });

        // If order is completed, award points and notify
        if (status === 'Completed' && order.status !== 'Completed') {
            // Award 10 points for every 100 rupees
            const points = Math.floor(order.totalAmount / 10);

            if (points > 0) {
                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: order.userId },
                        data: { rewardPoints: { increment: points } }
                    }),
                    prisma.reward.create({
                        data: {
                            userId: order.userId,
                            points: points,
                            type: "EARNED",
                            description: `Earned from Order #${order.id}`
                        }
                    }),
                    prisma.notification.create({
                        data: {
                            userId: order.userId,
                            title: "Order Completed",
                            message: `Your order #${order.id} is ready! You earned ${points} points.`
                        }
                    })
                ]);
            } else {
                await prisma.notification.create({
                    data: {
                        userId: order.userId,
                        title: "Order Completed",
                        message: `Your order #${order.id} is ready!`
                    }
                });
            }
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
};
