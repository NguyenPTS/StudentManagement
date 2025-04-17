import mongoose from "mongoose";
import { Class } from "../models/class.model";
import { ITeacher } from "../models/teacher.model";
import { IStudent } from "../models/student.model";
import { IClass } from "../models/class.model";
import { Types } from "mongoose";

// Helper function to convert day names to numbers (0 = Sunday, 1 = Monday, etc.)
function getDayNumber(day: string): number {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(day);
}

export async function seedClasses(
  teachers: (ITeacher & { _id: mongoose.Types.ObjectId })[],
  students: (IStudent & { _id: mongoose.Types.ObjectId })[]
) {
  try {
    console.log("Creating classes...");

    // Delete all existing classes
    await Class.deleteMany({});

    const classTemplates = [
      {
        name: "Mathematics 101",
        code: "MATH101",
        description: "Introduction to Calculus and Linear Algebra",
        teacherIndex: 0, // For the Mathematics teacher
        subject: "Mathematics",
        days: ["Monday", "Wednesday"]
      },
      {
        name: "Physics 101",
        code: "PHYS101",
        description: "Fundamentals of Physics",
        teacherIndex: 1, // For the Physics teacher
        subject: "Physics",
        days: ["Tuesday", "Thursday"]
      },
      {
        name: "Programming Fundamentals",
        code: "CS101",
        description: "Introduction to Programming and Computer Science",
        teacherIndex: 2, // For the Computer Science teacher
        subject: "Computer Science",
        days: ["Wednesday", "Friday"]
      }
    ];

    const classes = classTemplates.map((template) => {
      // Distribute students evenly among classes
      const classStudents = students.filter((_, index) => index % classTemplates.length === template.teacherIndex);

      return {
        name: template.name,
        code: template.code,
        description: template.description,
        teacher: teachers[template.teacherIndex]._id,
        students: classStudents.map(student => student._id),
        schedule: template.days.map(day => ({
          dayOfWeek: getDayNumber(day),
          startTime: "09:00",
          endTime: "10:30",
        })),
        maxStudents: 30,
        status: "active" as const
      };
    });

    const createdClasses = await Class.create(classes);

    console.log("✅ Classes seeded successfully:");
    createdClasses.forEach((cls: IClass) => {
      console.log(`  - ${cls.name} (${cls.code})`);
    });

    return createdClasses;
  } catch (error) {
    console.error("❌ Error seeding classes:", error);
    throw error;
  }
} 