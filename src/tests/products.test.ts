import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

let token: string;
let productId: number;

beforeAll(async () => {
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

it("should create a product", async () => {
  const res = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "pc",
      price: 123,
    });

  productId = res.body.data.id;
  expect(res.status).toBe(201);
});

it("should get all products", async () => {
  const res = await request(app).get("/api/products");
  expect(res.status).toBe(200);
});

it("should update a product", async () => {
  const res = await request(app)
    .put(`/api/products/${productId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Steam deck",
      price: 1000,
    });
  expect(res.status).toBe(200);
});

it("should delete a product", async () => {
  const res = await request(app)
    .delete(`/api/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.$disconnect();
});
