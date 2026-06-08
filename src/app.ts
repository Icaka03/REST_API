import express from "express";
import cors from "cors";
import helmet from "helmet";

// import routes
import userRoutes from "./routes/user.routes";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import passport from "./config/passport";
import oauthRoutes from "./routes/oauth.routes";
const app = express();

// Middleware
app.use(express.json()); // parses incoming JSON body
app.use(cors()); // allows cross-origin requests
app.use(helmet()); // sets secure headers
app.use(passport.initialize());
// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", oauthRoutes);
export default app;
