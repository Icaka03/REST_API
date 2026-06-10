# REST API with Authentication

A RESTful API built with Node.js, Express, TypeScript, PostgreSQL, and Prisma. Features secure authentication with JWT, email verification, OAuth login, rate limiting, and full product CRUD operations.

## Features

- User registration and login
- JWT authentication
- Password hashing with bcryptjs
- Email verification using Resend
- OAuth authentication with Google and GitHub
- Rate limiting for authentication endpoints
- PostgreSQL database with Prisma ORM
- Product CRUD operations
- TypeScript support
- Dockerized PostgreSQL

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcryptjs
- **Email Service:** Resend
- **OAuth Providers:** Google, GitHub
- **Rate Limiting:** Express Rate Limit
- **Deployment:** AWS EC2

---

## Getting Started

### Prerequisites

- Node.js
- Docker Desktop
- Google OAuth Credentials
- GitHub OAuth Credentials
- Resend API Key

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rest-api.git
cd rest-api
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Create a `.env` File

```env
DATABASE_URL="postgresql://admin:password@localhost:5432/mydb"

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

#### 4. Start PostgreSQL with Docker

```bash
docker run --name postgres \
-e POSTGRES_USER=admin \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=mydb \
-p 5432:5432 \
-d postgres
```

#### 5. Run Prisma Migrations

```bash
npx prisma migrate dev
```

#### 6. Start the Server

```bash
npm run dev
```

Server runs at:

```text
http://localhost:3000
```

---

## Authentication Flow

### Email & Password Authentication

```text
Register
   ↓
Verification Email (Resend)
   ↓
Verify Email
   ↓
Login
   ↓
JWT Token
   ↓
Protected Routes
```

### OAuth Authentication

```text
Google / GitHub OAuth
          ↓
      JWT Token
          ↓
   Protected Routes
```

---

## Rate Limiting

To protect against brute-force attacks and abuse, rate limiting is applied to authentication endpoints:

- Registration requests are limited
- Login requests are limited

If the limit is exceeded:

```json
{
  "message": "Too many requests, please try again later."
}
```

---

## API Endpoints

### Auth

| Method | Endpoint                        | Description           | Auth Required |
| ------ | ------------------------------- | --------------------- | ------------- |
| POST   | `/api/auth/register`            | Register a new user   | No            |
| POST   | `/api/auth/login`               | Login and receive JWT | No            |
| GET    | `/api/auth/verify-email/:token` | Verify email address  | No            |
| GET    | `/api/auth/google`              | Google OAuth login    | No            |
| GET    | `/api/auth/github`              | GitHub OAuth login    | No            |

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Registration successful. Please verify your email."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "your-jwt-token"
}
```

---

### Products

| Method | Endpoint            | Description      | Auth Required |
| ------ | ------------------- | ---------------- | ------------- |
| GET    | `/api/products`     | Get all products | No            |
| POST   | `/api/products`     | Create a product | Yes           |
| PUT    | `/api/products/:id` | Update a product | Yes           |
| DELETE | `/api/products/:id` | Delete a product | Yes           |

#### Create Product

```http
POST /api/products
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999
}
```

#### Update Product

```http
PUT /api/products/1
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Updated Laptop",
  "price": 1200
}
```

#### Delete Product

```http
DELETE /api/products/1
Authorization: Bearer <your-token>
```

---

### Users

| Method | Endpoint     | Description   | Auth Required |
| ------ | ------------ | ------------- | ------------- |
| GET    | `/api/users` | Get all users | No            |

---

## Using Protected Routes

1. Login and obtain a JWT token.
2. Include the token in the request header:

```http
Authorization: Bearer <your-token>
```

In Postman:

```text
Authorization → Bearer Token → Paste JWT
```

---

## Database

This project uses:

- PostgreSQL
- Prisma ORM

Useful Prisma commands:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

---

## Security Features

- JWT Authentication
- Password Hashing (bcryptjs)
- Email Verification with Resend
- Google OAuth
- GitHub OAuth
- Authentication Rate Limiting
- Environment Variable Protection
- Prisma ORM SQL Injection Protection

---

## Deployment

This API is deployed on an AWS EC2 instance.

Production deployment includes:

- Node.js application running on EC2
- PostgreSQL database
- Email verification with Resend
- Google & GitHub OAuth authentication
- JWT-based authorization
- Environment variable configuration

> Note: The EC2 instance may be stopped when not in use to reduce cloud infrastructure costs.

---
