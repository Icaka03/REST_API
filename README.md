# REST API with Authentication

A RESTful API built with Node.js, Express, TypeScript, PostgreSQL, and Prisma. Features JWT auth, email verification, OAuth, rate limiting, pagination, global error handling, and full test coverage.

**Live API:** `http://ec2-54-226-1-87.compute-1.amazonaws.com:3000`

> The EC2 instance may be stopped when not in use to reduce costs.

## Tech Stack

Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT, bcryptjs, Resend, Passport (Google & GitHub OAuth), Docker, AWS EC2, Jest, Supertest

## Features

- User registration, login, and email verification
- JWT authentication with protected routes
- Password hashing with bcryptjs
- Google and GitHub OAuth
- Rate limiting on auth endpoints
- Global error handling middleware
- Pagination on product listing
- Full CRUD for products
- Unit and integration tests with Jest and Supertest
- Isolated test database

---

## Getting Started

### Prerequisites

- Node.js
- Docker Desktop
- Google and GitHub OAuth credentials
- Resend API key

### Installation

```bash
git clone https://github.com/yourusername/rest-api.git
cd rest-api
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
JWT_SECRET="your-jwt-secret"
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
PORT=3000
NODE_ENV=development
```

### Start the Database

```bash
docker compose up db -d
```

### Run Migrations and Start

```bash
npx prisma migrate dev
npm run dev
```

Server runs at `http://localhost:3000`

---

## API Endpoints

Base URL (production): `http://ec2-54-226-1-87.compute-1.amazonaws.com:3000`

### Auth

| Method | Endpoint                        | Description           | Auth |
| ------ | ------------------------------- | --------------------- | ---- |
| POST   | `/api/auth/register`            | Register a new user   | No   |
| POST   | `/api/auth/login`               | Login and receive JWT | No   |
| GET    | `/api/auth/verify-email/:token` | Verify email          | No   |
| GET    | `/api/auth/google`              | Google OAuth          | No   |
| GET    | `/api/auth/github`              | GitHub OAuth          | No   |

### Products

| Method | Endpoint                        | Description              | Auth |
| ------ | ------------------------------- | ------------------------ | ---- |
| GET    | `/api/products?page=1&limit=10` | Get products (paginated) | No   |
| POST   | `/api/products`                 | Create a product         | Yes  |
| PUT    | `/api/products/:id`             | Update a product         | Yes  |
| DELETE | `/api/products/:id`             | Delete a product         | Yes  |

Protected routes require:

```http
Authorization: Bearer <your-token>
```

---

## Running Tests

Tests use a separate isolated database so your real data is never affected.

### Setup test database

```bash
# Create the test database
docker exec -it postgres_db psql -U postgres -c "CREATE DATABASE mydb_test;"

# Create .env.test
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb_test"

# Run migrations on test database
$env:DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb_test"; npx prisma migrate deploy
```

### Run tests

```bash
npm test
```

Covers: user registration, login, error handling, and full product CRUD.

---

## Deployment

Deployed on AWS EC2 (t3.micro) with Docker Compose. Both the Node.js app and PostgreSQL run as containers on the same instance.

To redeploy after changes:

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

---

## Useful Commands

```bash
npx prisma migrate dev --name description   # create and apply migration
npx prisma generate                          # regenerate Prisma client
npx prisma studio                            # open database GUI
docker compose up db -d                      # start database only
docker compose down -v                       # stop and remove volumes
```
