import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedClasses } from "./class.seed";
import { seedUsers } from "./user.seed";
import { seedTeachers } from './teacher.seed';
import { seedStudents } from './student.seed';
import { seedGrades } from './grade.seed';
import { ITeacher } from '../models/teacher.model';
import { IStudent } from '../models/student.model';
import { IClass } from '../models/class.model';
import { UserDocument } from '../models/user.model';

// Load environment variables
dotenv.config();

type TeacherDocument = mongoose.Document<unknown, {}, ITeacher> & ITeacher & { _id: mongoose.Types.ObjectId };
type StudentDocument = mongoose.Document<unknown, {}, IStudent> & IStudent & { _id: mongoose.Types.ObjectId };
type ClassDocument = mongoose.Document<unknown, {}, IClass> & IClass & { _id: mongoose.Types.ObjectId };

async function seed() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing collections
    console.log('Clearing existing collections...');
    const collections = ['users', 'teachers', 'students', 'classes', 'grades'];
    for (const collection of collections) {
      try {
        await mongoose.connection.collection(collection).drop();
        console.log(`Dropped collection: ${collection}`);
      } catch (error: any) {
        // Ignore collection not found errors
        if (error.code !== 26) {
          console.warn(`Warning dropping collection ${collection}:`, error.message);
        }
      }
    }
    console.log('Collections cleared');

    // Seed data in order
    const users = (await seedUsers()) as unknown as UserDocument[];
    console.log('Users seeded...');

    const teacherUsers = users.filter(u => u.role === 'teacher');
    const teachers = (await seedTeachers(teacherUsers)) as unknown as TeacherDocument[];
    console.log('Teachers seeded...');

    const students = (await seedStudents()) as unknown as StudentDocument[];
    console.log('Students seeded...');

    const classes = (await seedClasses(teachers, students)) as unknown as ClassDocument[];
    console.log('Classes seeded...');

    await seedGrades(students, classes);
    console.log('Grades seeded...');

    console.log("\n✅ Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed(); 