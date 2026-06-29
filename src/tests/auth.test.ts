import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

let token: string;

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      email: "test@test.com",
      password: await bcrypt.hash("12345678", 10),
      name: "Test User",
      isVerified: true,
    },
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@test.com", password: "12345678" });

  token = res.body.token;
});

it("should register with correct credentials", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "testing@test.com",
    password: "12345678",
    name: "TestName",
  });

  expect(res.status).toBe(201);
});

it("should login with correct credentials", async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "test@test.com",
    password: "12345678",
  });

  expect(res.status).toBe(201);
});

it("should throw an error if user already exists", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "testing@test.com",
    password: "12345678",
    name: "TestName",
  });

  expect(res.status).toBe(400);
  expect(res.body.message).toBe("User already exists");
});

it("should throw an error if user login with wrong credentials", async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "test@test.comm",
    password: "1234567890",
  });

  expect(res.status).toBe(400);
  expect(res.body.message).toBe("no user found");
});

it("should throw an error if user login with unverified email", async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "testing@test.com",
    password: "12345678",
  });

  expect(res.status).toBe(403);
  expect(res.body.message).toBe("user not verified");
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.$disconnect();
});
