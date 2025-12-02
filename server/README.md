# 🖥️ Mess Management System - Backend (Server)

Node.js + Express backend API for the Mess Management System. Provides RESTful endpoints for authentication, menu management, order processing, and analytics.

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.1.0
- **Database:** PostgreSQL
- **ORM:** Prisma 6.18.0
- **Authentication:** JWT + bcrypt
- **Middleware:** CORS, Cookie Parser, Morgan (logging)

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- PostgreSQL database instance
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed

# Start server
npm run start
```

Server will run on `http://localhost:8000` by default.

## 🔑 Environment Variables

Create a `.env` file in the server directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mess_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port
PORT=8000

# Node Environment
NODE_ENV=development
```

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.js             # Database seeding
├── src/
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── feedbackController.js
│   │   ├── rewardsController.js
│   │   ├── weeklyMenuController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── ...
│   └── server.js          # Entry point
├── createAdmin.js         # Admin user creation script
├── test-login.js         # Login testing script
├── .env.example          # Environment template
└── package.json
```

## 🛣️ API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Authenticated |
| GET | `/validate` | Validate JWT token | Authenticated |
| GET | `/me` | Get current user | Authenticated |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securePassword123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Menu Items (`/api/menu`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items` | Get all menu items | Authenticated |
| GET | `/items/:id` | Get single item | Authenticated |
| POST | `/items` | Create menu item | Admin |
| PUT | `/items/:id` | Update menu item | Admin |
| DELETE | `/items/:id` | Delete menu item | Admin |
| GET | `/outlets` | Get all outlets | Authenticated |

**Create Menu Item Request:**
```json
{
  "name": "Masala Dosa",
  "category": "Breakfast",
  "price": 45.00,
  "quantity": 100,
  "preparationTime": "15 mins",
  "isAvailable": true,
  "outletId": 1
}
```

### Orders (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user orders | Authenticated |
| GET | `/all` | Get all orders | Admin |
| GET | `/:id` | Get order details | Authenticated |
| POST | `/` | Create new order | Authenticated |
| PUT | `/:id/status` | Update order status | Staff/Admin |
| DELETE | `/:id` | Cancel order | Authenticated |

**Create Order Request:**
```json
{
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 3,
      "quantity": 1
    }
  ],
  "totalAmount": 150.00,
  "paymentMethod": "UPI"
}
```

### Feedback (`/api/feedback`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all feedback | Admin |
| GET | `/user` | Get user's feedback | Authenticated |
| POST | `/` | Submit feedback | Authenticated |

**Submit Feedback Request:**
```json
{
  "rating": 5,
  "comment": "Excellent food quality and service!"
}
```

### Rewards (`/api/rewards`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user rewards | Authenticated |
| GET | `/points` | Get total points | Authenticated |
| POST | `/earn` | Award points | Admin |
| POST | `/redeem` | Redeem points | Authenticated |

### Weekly Menu (`/api/weekly-menu`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get weekly menu | Authenticated |
| GET | `/day/:day` | Get menu for specific day | Authenticated |
| POST | `/` | Create/update weekly menu | Admin |
| DELETE | `/:id` | Delete menu entry | Admin |

**Weekly Menu Request:**
```json
{
  "day": "MONDAY",
  "mealType": "BREAKFAST",
  "items": "Idli, Vada, Sambar, Chutney",
  "weekDate": "2024-12-02"
}
```

### Analytics (`/api/analytics`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard` | Dashboard metrics | Admin |
| GET | `/sales` | Sales analytics | Admin |
| GET | `/popular-items` | Most ordered items | Admin |
| GET | `/student/:id` | Student analytics | Admin |

## 🗄️ Database Schema

### Core Models

#### User
```prisma
model User {
  id            Int      @id @default(autoincrement())
  name          String
  email         String   @unique
  password      String
  phone         String   @unique
  role          Role     @default(STUDENT)
  rewardPoints  Int      @default(0)
  createdAt     DateTime @default(now())
}

enum Role {
  STUDENT
  ADMIN
  STAFF
}
```

#### MenuItem
```prisma
model MenuItem {
  id              Int      @id @default(autoincrement())
  name            String
  category        String
  price           Float
  quantity        Int?     @default(100)
  preparationTime String?
  isAvailable     Boolean  @default(true)
  outletId        Int?
  createdAt       DateTime @default(now())
}
```

#### Order
```prisma
model Order {
  id            Int      @id @default(autoincrement())
  userId        Int
  totalAmount   Float
  status        String   @default("Pending")
  paymentStatus String   @default("Unpaid")
  qrCode        String?
  createdAt     DateTime @default(now())
}
```

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema.

## 🔐 Authentication & Authorization

### JWT Authentication
- Tokens are generated on login and stored in HTTP-only cookies
- Tokens expire after 24 hours
- Refresh mechanism can be implemented as needed

### Role-Based Access Control
- **STUDENT:** Access own orders, menu, profile
- **STAFF:** Access QR validation, order updates
- **ADMIN:** Full access to all resources

### Middleware Usage
```javascript
const { protect, authorize } = require('./middleware/authMiddleware');

// Protected route (any authenticated user)
router.get('/profile', protect, getProfile);

// Admin-only route
router.post('/menu/items', protect, authorize('ADMIN'), createMenuItem);

// Multiple roles
router.put('/orders/:id', protect, authorize('STAFF', 'ADMIN'), updateOrder);
```

## 🧪 Development

### Database Commands

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed
```

### Creating Admin User

```bash
node createAdmin.js
```

Follow the prompts to create an admin account.

### Testing API

Use the included test script:
```bash
node test-login.js
```

Or use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Logging

Morgan middleware logs all HTTP requests:
```
GET /api/menu/items 200 45.123 ms
POST /api/orders 201 123.456 ms
```

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies for token storage
- ✅ CORS configured for frontend origin
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via Prisma ORM
- ⚠️ **Remember to change JWT_SECRET in production**
- ⚠️ **Use HTTPS in production**
- ⚠️ **Enable rate limiting for production**

## 📊 Database Seeding

The seed file populates the database with:
- Sample outlets (Darshani, Fuel Up)
- Menu items for each outlet
- Sample users (students, staff, admin)

Run seeding:
```bash
npx prisma db seed
```

## 🐛 Common Issues

### Database Connection Errors
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database exists: `createdb mess_db`

### Prisma Client Errors
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Migration Issues
```bash
# Reset and reapply migrations
npx prisma migrate reset
npx prisma migrate dev
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 📝 Contributing

When contributing to the backend:
1. Follow RESTful API conventions
2. Add proper error handling
3. Include input validation
4. Update Prisma schema if needed
5. Document new endpoints in this README
6. Test thoroughly before committing

## 📄 Scripts

```json
{
  "start": "nodemon src/server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/)

## 📄 License

This project is part of the Mess Management System. See [../README.md](../README.md) for license information.

---

Built with Node.js and Express by Team Optimus
