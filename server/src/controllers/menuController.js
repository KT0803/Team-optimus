const { prisma } = require("../config/db");

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await prisma.menuItem.findMany({
            include: { outlet: true }
        });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { outlet: true }
        });

        if (menuItem) {
            res.json(menuItem);
        } else {
            res.status(404).json({ message: "Menu item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all outlets
// @route   GET /api/menu/outlets
// @access  Public
const getOutlets = async (req, res) => {
    try {
        const outlets = await prisma.outlet.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(outlets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
    const { name, category, price, preparationTime, quantity, outletId } = req.body;

    try {
        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                category,
                price: parseFloat(price),
                preparationTime,
                quantity: quantity ? parseInt(quantity) : 100,
                outletId: outletId ? parseInt(outletId) : null,
            },
        });
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
    const { name, category, price, preparationTime, quantity, isAvailable, outletId } = req.body;

    try {
        const menuItem = await prisma.menuItem.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                category,
                price: parseFloat(price),
                preparationTime,
                quantity: quantity !== undefined ? parseInt(quantity) : undefined,
                isAvailable,
                outletId: outletId ? parseInt(outletId) : undefined,
            },
        });
        res.json(menuItem);
    } catch (error) {
        res.status(404).json({ message: "Menu item not found" });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    try {
        await prisma.menuItem.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: "Menu item removed" });
    } catch (error) {
        res.status(404).json({ message: "Menu item not found" });
    }
};

module.exports = {
    getMenuItems,
    getMenuItemById,
    getOutlets,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
};