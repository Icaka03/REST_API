import express from "express";
import cors from "cors";
import helmet from "helmet";

// import routes
import userRoutes from "./routes/user.routes";
import productsRoutes from "./routes/products.routes";

const app = express();

// Middleware
app.use(express.json()); // parses incoming JSON body
app.use(cors()); // allows cross-origin requests
app.use(helmet()); // sets secure headers

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
export default app;
