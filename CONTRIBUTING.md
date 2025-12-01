# Contributing Guidelines

## Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use async/await for asynchronous operations
- Add JSDoc comments for all exported functions

## Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## Testing Requirements

- All new features must include tests
- Maintain minimum 80% code coverage
- Tests should cover happy path and error cases
- Use descriptive test names

## API Design Principles

### Authentication & Authorization

All write operations (POST, PUT, PATCH, DELETE) must require authentication unless explicitly documented otherwise. The authorization levels are:

- **Public endpoints**: GET requests for products (no auth required)
- **User endpoints**: Require authentication, users can only access their own resources
- **Admin endpoints**: Require admin or superadmin role
- **Superadmin endpoints**: Require superadmin role only

### Error Responses

Always return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad request / Validation error
- 401: Unauthorized (not authenticated)
- 403: Forbidden (not authorized)
- 404: Not found
- 409: Conflict (e.g., duplicate)
- 500: Internal server error

Error responses must include an `error` field with a descriptive message.

### Validation

All request data must be validated before processing:

1. Use Joi schemas in the `validators/` directory
2. Validate in controllers before business logic
3. Return 400 status with validation errors
4. Mongoose schema validation is a backup, not primary validation

### Database Operations

- Always use Mongoose models, never direct MongoDB operations
- Add appropriate indexes for frequently queried fields
- Use `.select('-password')` to exclude sensitive fields from responses
- Prefer soft deletes (isActive flag) over hard deletes for important data

## Adding New Features

### Adding a New Model

1. Create model in `src/models/`
2. Define TypeScript interface
3. Add Mongoose schema with validation
4. Add appropriate indexes
5. Export the model

### Adding a New Endpoint

1. Create/update controller in `src/controllers/`
2. Create/update routes in `src/routes/`
3. Add validation schema in `src/validators/`
4. Apply authentication/authorization middleware
5. Add tests in `tests/`
6. Update README.md API documentation

### Adding Middleware

1. Create middleware in `src/middleware/`
2. Export the middleware function
3. Add JSDoc documentation
4. Import and apply in routes or server.ts

## Security Considerations

- Never commit secrets or credentials
- Always hash passwords using bcrypt
- Validate and sanitize all user input
- Use parameterized queries (Mongoose does this automatically)
- Keep dependencies updated
- Follow OWASP security best practices

## Performance Guidelines

- Add database indexes for frequently queried fields
- Use pagination for endpoints that return lists
- Implement rate limiting on public endpoints
- Consider caching for frequently accessed data
- Use `.select()` to limit returned fields

## Documentation

- Update README.md when adding new endpoints
- Add JSDoc comments for all public functions
- Document expected request/response formats
- Note any breaking changes in commit messages

## Common Patterns in This Codebase

### Controller Pattern

```typescript
export const functionName = async (req: AuthRequest, res: Response) => {
  try {
    // Validation
    // Business logic
    // Database operations
    // Send response
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
```

### Route Protection Pattern

```typescript
router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  controllerFunction
);
```

### Validation Pattern

```typescript
// Define schema in validators/
export const schema = Joi.object({...});

// Use in controller
const { error } = schema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

## Questions?

If you're unsure about anything:

1. Check existing code for similar patterns
2. Review the README.md
3. Look for TODO comments that might provide context
4. Check the validators for documented requirements
