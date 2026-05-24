# REST API with Auth

A RESTful API built with Node.js, Express, TypeScript, PostgreSQL and Prisma. Features user authentication with JWT and product management.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma
- **Auth:** JWT + bcryptjs

## Getting Started

### Prerequisites

- Node.js
- Docker Desktop

### Installation

1. Clone the repo

```bash
git clone https://github.com/yourusername/rest-api.git
cd rest-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://admin:password@localhost:5432/mydb"
JWT_SECRET="your-jwt-secret"
PORT=3000
NODE_ENV=development
```

4. Start PostgreSQL with Docker

```bash
docker run --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
```

5. Run Prisma migrations

```bash
npx prisma migrate dev
```

6. Start the server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user         | No            |
| POST   | `/api/auth/login`    | Login and receive JWT token | No            |

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns a JWT token — use it on protected routes.

---

### Products

| Method | Endpoint        | Description      | Auth Required |
| ------ | --------------- | ---------------- | ------------- |
| GET    | `/api/products` | Get all products | No            |
| POST   | `/api/products` | Create a product | Yes           |

#### Create Product (Protected)

```
POST /api/products
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999
}
```

---

### Users

| Method | Endpoint     | Description   | Auth Required |
| ------ | ------------ | ------------- | ------------- |
| GET    | `/api/users` | Get all users | No            |

---

## Using Protected Routes

1. Login via `POST /api/auth/login` and copy the token from the response
2. On protected requests add this header:

```
Authorization: Bearer <your-token>
```

In Postman: Auth tab → Bearer Token → paste token.
