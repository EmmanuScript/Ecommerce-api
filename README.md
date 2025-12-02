# E-Commerce REST API

A simple e-commerce REST API built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- Product management
- Order processing
- Role-based access control (RBAC)
- MongoDB for data persistence
- JWT-based authentication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote instance)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ecommerce-api
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project

```bash
npm run build
```

5. Start the server

```bash
npm start
# For development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3000` by default.

## API Documentation

### Authentication

All write operations require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

The API implements a role-based access control system with the following hierarchy:

- **customer**: Basic user role (default for new registrations)

  - Can view products
  - Can create and view their own orders
  - Can update their own profile

- **admin**: Administrative role

  - All customer permissions
  - Can create, update, and delete products
  - Can view all orders
  - Can update order status
  - Can view all users

- **superadmin**: Highest privilege level
  - All admin permissions
  - Can delete users
  - Full system access

### Endpoints

#### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT token
- `GET /api/users/profile` - Get authenticated user's profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete a user (superadmin only)

#### Products

- `GET /api/products` - Get all products (supports pagination and filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

#### Orders

- `POST /api/orders` - Create a new order (requires auth)
- `GET /api/orders/my-orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)
- `GET /api/orders` - Get all orders (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `POST /api/orders/:id/cancel` - Cancel an order (requires auth)

### Payment Methods

The system supports the following payment methods:

- `credit_card`
- `debit_card`
- `paypal`

When creating an order, specify one of these values in the `paymentMethod` field.

### Product Categories

Products are organized by categories. While not strictly enforced at the database level, the following categories are commonly used:

- electronics
- clothing
- books
- home
- sports

### Order Status Flow

Orders progress through the following statuses:

1. `pending` - Order created, awaiting processing
2. `processing` - Order is being prepared
3. `shipped` - Order has been shipped
4. `delivered` - Order has been delivered
5. `cancelled` - Order was cancelled

Payment status can be:

- `pending` - Payment not yet processed
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment was refunded

## Example Requests

### Register a new user

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a product (admin only)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "electronics",
    "stock": 50
  }'
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict (e.g., duplicate entry)
- 500: Internal Server Error

### Error Response Format

All error responses follow a consistent JSON structure. Clients should rely on these fields to render messages and handle errors programmatically.

```
{
  "error": "Short machine-readable error name",
  "message": "Human-readable description of the problem",
  "details": { /* optional object with field-specific issues */ },
  "code": "optional_app_specific_code",
  "timestamp": "ISO-8601 timestamp"
}
```

- `error`: Concise identifier (e.g., `Validation Error`, `Invalid Token`, `Duplicate Entry`).
- `message`: Clear explanation suitable for display to users.
- `details` (optional): Additional context. For validation errors, include per-field messages (e.g., `{ "email": "Invalid format" }`).
- `code` (optional): Application-specific code if needed for clients.
- `timestamp`: When the error occurred (server time in ISO format).

Examples:

- Validation error (400):

```
{
  "error": "Validation Error",
  "message": "Request body failed validation",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  },
  "timestamp": "2025-12-02T10:15:30.000Z"
}
```

- Authentication error (401):

```
{
  "error": "Invalid Token",
  "message": "Authentication token is invalid",
  "timestamp": "2025-12-02T10:15:30.000Z"
}
```

- Not found (404):

```
{
  "error": "Not Found",
  "message": "User not found",
  "timestamp": "2025-12-02T10:15:30.000Z"
}
```

Success responses should not include the `error` field.

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
src/
├── config/         # Configuration files (database, etc.)
├── controllers/    # Route controllers
├── middleware/     # Custom middleware (auth, logging, etc.)
├── models/         # Database models
├── routes/         # API routes
└── server.ts       # Application entry point
```

## Known Issues and TODOs

See inline `TODO` comments in the code for planned improvements and missing features.

## License

MIT
