const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Test Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@mess.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'ADMIN',
        },
    });

    const studentUser = await prisma.user.create({
        data: {
            name: 'Student User',
            email: 'student@mess.com',
            password: hashedPassword,
            phone: '1234567892',
            role: 'STUDENT',
        },
    });

    console.log('Created Users:', { adminUser,  studentUser });

    // Create Outlets
    const mainMess = await prisma.outlet.create({
        data: {
            name: 'Main Mess',
            location: 'Central Block',
        },
    });

    const cafeDelight = await prisma.outlet.create({
        data: {
            name: 'Cafe Delight',
            location: 'Student Center',
        },
    });

    const fuelUp = await prisma.outlet.create({
        data: {
            name: 'Fuel Up',
            location: 'Sports Complex',
        },
    });

    console.log('Created Outlets:', { mainMess, cafeDelight, fuelUp });

    // Create Menu Items for Main Mess
    const mainMessItems = [
        { name: 'Idli Sambar', category: 'Breakfast', price: 40, preparationTime: '10 mins', outletId: mainMess.id },
        { name: 'Masala Dosa', category: 'Breakfast', price: 60, preparationTime: '15 mins', outletId: mainMess.id },
        { name: 'Veg Thali', category: 'Lunch', price: 120, preparationTime: '5 mins', outletId: mainMess.id },
        { name: 'Chicken Biryani', category: 'Lunch', price: 180, preparationTime: '20 mins', outletId: mainMess.id },
        { name: 'Paneer Butter Masala', category: 'Dinner', price: 150, preparationTime: '15 mins', outletId: mainMess.id },
    ];

    for (const item of mainMessItems) {
        await prisma.menuItem.create({ data: item });
    }

    // Create Menu Items for Cafe Delight
    const cafeItems = [
        { name: 'Cold Coffee', category: 'Beverages', price: 80, preparationTime: '5 mins', outletId: cafeDelight.id },
        { name: 'Veg Burger', category: 'Snacks', price: 90, preparationTime: '10 mins', outletId: cafeDelight.id },
        { name: 'Cheese Sandwich', category: 'Snacks', price: 70, preparationTime: '10 mins', outletId: cafeDelight.id },
        { name: 'Chocolate Brownie', category: 'Dessert', price: 60, preparationTime: '2 mins', outletId: cafeDelight.id },
    ];

    for (const item of cafeItems) {
        await prisma.menuItem.create({ data: item });
    }

    // Create Menu Items for Fuel Up
    const fuelUpItems = [
        { name: 'Protein Shake', category: 'Beverages', price: 100, preparationTime: '5 mins', outletId: fuelUp.id },
        { name: 'Fruit Salad', category: 'Snacks', price: 80, preparationTime: '5 mins', outletId: fuelUp.id },
        { name: 'Oats Bowl', category: 'Breakfast', price: 70, preparationTime: '5 mins', outletId: fuelUp.id },
    ];

    for (const item of fuelUpItems) {
        await prisma.menuItem.create({ data: item });
    }

    console.log('Seeding finished.');
    console.log('\n📧 Test Account Credentials:');
    console.log('Admin: admin@mess.com / password123');
    console.log('Staff: staff@mess.com / password123');
    console.log('Student: student@mess.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
