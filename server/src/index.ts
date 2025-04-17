import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { requestLogger } from "./middlewares/logger.middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import studentRoutes from "./routes/student.routes";
import classRoutes from "./routes/class.routes";
import teacherRoutes from "./routes/teacher.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Swagger setup
console.log("\n📚 Initializing Swagger...");
try {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger initialized successfully");
  console.log("📖 Swagger documentation available at http://localhost:5000/api-docs");
} catch (error) {
  console.error("❌ Swagger initialization error:", error);
}

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "";

// Connect MongoDB
console.log("\n🔌 Connecting to MongoDB...");
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
console.log("\n🛣️  Registering routes...");
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/students", studentRoutes);
app.use("/classes", classRoutes);
app.use("/teachers", teacherRoutes);
console.log("✅ Routes registered successfully");

// Log all registered routes
console.log("\n📝 Registered Routes:");
const routes = [
  { path: "/auth", methods: ["GET", "POST", "PUT", "DELETE"] },
  { path: "/users", methods: ["GET", "POST", "PUT", "DELETE"] },
  { path: "/students", methods: ["GET", "POST", "PUT", "DELETE"] },
  { path: "/classes", methods: ["GET", "POST", "PUT", "DELETE"] },
  { path: "/teachers", methods: ["GET", "POST", "PUT", "DELETE"] },
];

routes.forEach(route => {
  console.log(`\n${route.path}:`);
  console.log(`  ${route.methods.join(", ")} ${route.path}`);
  console.log(`  ${route.methods.join(", ")} ${route.path}/:id`);
});

app.get("/", (_, res) => {
  res.send("🎓 StudentManagement API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
