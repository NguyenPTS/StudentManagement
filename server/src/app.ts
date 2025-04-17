import express from "express";
import cors from "cors";
import morgan from "morgan";
import classRoutes from "./routes/class.routes";
import teacherRoutes from "./routes/teacher.routes";
import gradeRoutes from './routes/grade.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/classes", classRoutes);
app.use("/teachers", teacherRoutes);
app.use('/api/grades', gradeRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Có lỗi xảy ra!" });
});

export default app; 