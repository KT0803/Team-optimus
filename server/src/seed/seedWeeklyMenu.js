const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const weeklyMenuData = [
    // Monday
    { day: 'MONDAY', mealType: 'BREAKFAST', items: 'Idli Sambar, Chutney, Tea/Coffee' },
    { day: 'MONDAY', mealType: 'LUNCH', items: 'Rice, Dal Fry, Aloo Gobi, Chapati, Salad, Curd' },
    { day: 'MONDAY', mealType: 'SNACKS', items: 'Samosa, Tea' },
    { day: 'MONDAY', mealType: 'DINNER', items: 'Veg Pulao, Raita, Paneer Butter Masala, Chapati' },

    // Tuesday
    { day: 'TUESDAY', mealType: 'BREAKFAST', items: 'Poha, Sev, Tea/Coffee' },
    { day: 'TUESDAY', mealType: 'LUNCH', items: 'Rice, Rajma Masala, Bhindi Fry, Chapati, Salad, Pickle' },
    { day: 'TUESDAY', mealType: 'SNACKS', items: 'Biscuits, Tea' },
    { day: 'TUESDAY', mealType: 'DINNER', items: 'Egg Curry / Paneer Curry, Rice, Chapati' },

    // Wednesday
    { day: 'WEDNESDAY', mealType: 'BREAKFAST', items: 'Upma, Chutney, Tea/Coffee' },
    { day: 'WEDNESDAY', mealType: 'LUNCH', items: 'Rice, Dal Tadka, Mix Veg, Chapati, Salad, Papad' },
    { day: 'WEDNESDAY', mealType: 'SNACKS', items: 'Vada Pav, Tea' },
    { day: 'WEDNESDAY', mealType: 'DINNER', items: 'Chicken Biryani / Veg Biryani, Raita, Salan' },

    // Thursday
    { day: 'THURSDAY', mealType: 'BREAKFAST', items: 'Paratha, Curd, Pickle, Tea/Coffee' },
    { day: 'THURSDAY', mealType: 'LUNCH', items: 'Rice, Chole Masala, Jeera Aloo, Chapati, Salad' },
    { day: 'THURSDAY', mealType: 'SNACKS', items: 'Maggi, Tea' },
    { day: 'THURSDAY', mealType: 'DINNER', items: 'Dal Makhani, Jeera Rice, Chapati, Sweet' },

    // Friday
    { day: 'FRIDAY', mealType: 'BREAKFAST', items: 'Dosa, Sambar, Chutney, Tea/Coffee' },
    { day: 'FRIDAY', mealType: 'LUNCH', items: 'Rice, Sambar, Poriyal, Chapati, Salad, Curd' },
    { day: 'FRIDAY', mealType: 'SNACKS', items: 'Sandwich, Tea' },
    { day: 'FRIDAY', mealType: 'DINNER', items: 'Fried Rice, Manchurian, Noodles' },

    // Saturday
    { day: 'SATURDAY', mealType: 'BREAKFAST', items: 'Puri Bhaji, Tea/Coffee' },
    { day: 'SATURDAY', mealType: 'LUNCH', items: 'Rice, Kadi Pakora, Karela Fry, Chapati, Salad' },
    { day: 'SATURDAY', mealType: 'SNACKS', items: 'Bhel Puri, Tea' },
    { day: 'SATURDAY', mealType: 'DINNER', items: 'Khichdi, Kadhi, Papad, Pickle' },

    // Sunday
    { day: 'SUNDAY', mealType: 'BREAKFAST', items: 'Bread Omelette / Bread Jam, Tea/Coffee' },
    { day: 'SUNDAY', mealType: 'LUNCH', items: 'Special Thali (Paneer/Chicken, Sweet, Farsan)' },
    { day: 'SUNDAY', mealType: 'SNACKS', items: 'Cake/Pastry, Tea' },
    { day: 'SUNDAY', mealType: 'DINNER', items: 'Light Dinner (Soup, Salad, Bread)' }
];

async function seedWeeklyMenu() {
    console.log('Seeding weekly menu data...');

    try {
        // Delete existing weekly menu data
        await prisma.weeklyMenu.deleteMany({});
        console.log('Cleared existing weekly menu data');

        // Insert new data
        for (const menuItem of weeklyMenuData) {
            await prisma.weeklyMenu.create({
                data: menuItem
            });
        }

        console.log(`✅ Seeded ${weeklyMenuData.length} weekly menu items successfully!`);
    } catch (error) {
        console.error('Error seeding weekly menu data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedWeeklyMenu();
