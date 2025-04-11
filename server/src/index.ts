import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./config/swagger";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user.routes";
import studentRoutes from "./routes/student.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "";

// Connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/students", studentRoutes);

app.get("/", (_, res) => {
  res.send("🎓 StudentManagement API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
