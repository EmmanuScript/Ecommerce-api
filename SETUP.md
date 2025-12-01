# Quick Setup Guide

## Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- Other settings as needed

3. **Start MongoDB**:

```bash
# If using local MongoDB
mongod
```

4. **Build the project**:

```bash
npm run build
```

5. **Run in development mode**:

```bash
npm run dev
```

6. **Run in production mode**:

```bash
npm start
```

## Running Tests

```bash
npm test
```

## Creating an Admin User

Since new users are created with 'customer' role by default, you'll need to manually update a user's role in the database:

```bash
# Connect to MongoDB
mongosh

# Use the ecommerce database
use ecommerce

# Update a user's role to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Quick API Test

1. **Register a user**:

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

2. **Login**:

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

3. **Get profile**:

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### MongoDB Connection Failed

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB is accessible

### Port Already in Use

- Change PORT in .env
- Or kill the process using port 3000

### TypeScript Compilation Errors

- Run `npm install` to ensure all dependencies are installed
- Check tsconfig.json settings
- Ensure TypeScript version is compatible

## Project Structure

```
ecommerce-api/
├── src/
│   ├── config/           # Configuration (database)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── validators/      # Joi validation schemas
│   └── server.ts        # Entry point
├── tests/               # Test files
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables (create from .env.example)
└── README.md           # Full documentation
```
