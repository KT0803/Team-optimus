const { prisma } = require("../config/db");

// Helper function to get the Monday of the current week
const getMondayOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
};

// @desc    Get weekly menu for current week
// @route   GET /api/weekly-menu
// @access  Public
const getWeeklyMenu = async (req, res) => {
    try {
        const { week } = req.query;
        let weekDate = null;

        if (week) {
            weekDate = new Date(week);
        } else {
            weekDate = getMondayOfWeek();
        }

        // Set to start of day
        weekDate.setHours(0, 0, 0, 0);

        const weeklyMenu = await prisma.weeklyMenu.findMany({
            where: {
                OR: [
                    { weekDate: weekDate },
                    { weekDate: null } // Get default menu if no specific week is set
                ]
            },
            orderBy: [
                { day: 'asc' }
            ]
        });

        res.json(weeklyMenu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current week's menu organized by day
// @route   GET /api/weekly-menu/current
// @access  Public
const getCurrentWeekMenu = async (req, res) => {
    try {
        const weekDate = getMondayOfWeek();
        weekDate.setHours(0, 0, 0, 0);

        const weeklyMenu = await prisma.weeklyMenu.findMany({
            where: {
                OR: [
                    { weekDate: weekDate },
                    { weekDate: null }
                ]
            }
        });

        // Organize by day
        const organizedMenu = {
            MONDAY: {},
            TUESDAY: {},
            WEDNESDAY: {},
            THURSDAY: {},
            FRIDAY: {},
            SATURDAY: {},
            SUNDAY: {}
        };

        weeklyMenu.forEach(item => {
            organizedMenu[item.day][item.mealType] = item.items;
        });

        res.json(organizedMenu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a weekly menu item
// @route   POST /api/weekly-menu
// @access  Private/Admin
const createWeeklyMenuItem = async (req, res) => {
    const { day, mealType, items, weekDate } = req.body;

    try {
        let parsedWeekDate = null;
        if (weekDate) {
            parsedWeekDate = new Date(weekDate);
            parsedWeekDate.setHours(0, 0, 0, 0);
        }

        const menuItem = await prisma.weeklyMenu.create({
            data: {
                day,
                mealType,
                items,
                weekDate: parsedWeekDate
            }
        });

        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a weekly menu item
// @route   PUT /api/weekly-menu/:id
// @access  Private/Admin
const updateWeeklyMenuItem = async (req, res) => {
    const { day, mealType, items, weekDate } = req.body;

    try {
        let parsedWeekDate = undefined;
        if (weekDate !== undefined) {
            parsedWeekDate = weekDate ? new Date(weekDate) : null;
            if (parsedWeekDate) {
                parsedWeekDate.setHours(0, 0, 0, 0);
            }
        }

        const menuItem = await prisma.weeklyMenu.update({
            where: { id: parseInt(req.params.id) },
            data: {
                day,
                mealType,
                items,
                weekDate: parsedWeekDate
            }
        });

        res.json(menuItem);
    } catch (error) {
        res.status(404).json({ message: "Weekly menu item not found" });
    }
};

// @desc    Delete a weekly menu item
// @route   DELETE /api/weekly-menu/:id
// @access  Private/Admin
const deleteWeeklyMenuItem = async (req, res) => {
    try {
        await prisma.weeklyMenu.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: "Weekly menu item removed" });
    } catch (error) {
        res.status(404).json({ message: "Weekly menu item not found" });
    }
};

module.exports = {
    getWeeklyMenu,
    getCurrentWeekMenu,
    createWeeklyMenuItem,
    updateWeeklyMenuItem,
    deleteWeeklyMenuItem
};
