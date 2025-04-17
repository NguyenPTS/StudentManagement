import mongoose from "mongoose";
import Teacher, { ITeacher } from "../models/teacher.model";
import { IUser, UserDocument } from "../models/user.model";

export async function seedTeachers(teacherUsers: UserDocument[]) {
  try {
    if (!teacherUsers || teacherUsers.length === 0) {
      throw new Error("No teacher users provided for seeding teachers");
    }

    console.log(`Creating ${teacherUsers.length} teacher records...`);

    // Delete all existing teachers
    await Teacher.deleteMany({});

    // Create teacher records with more detailed information
    const teachers = teacherUsers.map((user, index) => {
      const specializations = [
        ["Mathematics", "Statistics"],
        ["Physics", "Chemistry"],
        ["Computer Science", "Programming"]
      ];

      const qualifications = [
        ["Ph.D. in Mathematics", "Master in Education"],
        ["Ph.D. in Physics", "Master in Science Education"],
        ["Master in Computer Science", "Bachelor in Education"]
      ];

      return {
        user: user._id,
        specialization: specializations[index % specializations.length],
        qualifications: qualifications[index % qualifications.length],
        experience: 5 + index,
        rating: 4.5,
        totalRatings: 10,
        subjects: specializations[index % specializations.length],
        achievements: [
          {
            title: "Best Teacher Award 2023",
            description: "Awarded for excellence in teaching and student engagement",
            date: new Date("2023-12-01")
          },
          {
            title: "Published Research Paper",
            description: "Published in a leading educational journal",
            date: new Date("2023-06-15")
          },
          {
            title: "Department Excellence Award",
            description: "Recognized for outstanding contribution to the department",
            date: new Date("2023-09-30")
          }
        ],
        status: "active" as const
      };
    });

    const createdTeachers = await Teacher.create(teachers);

    console.log("✅ Teachers seeded successfully:");
    createdTeachers.forEach((teacher) => {
      console.log(`  - Teacher ID: ${teacher._id} (${teacher.specialization.join(", ")})`);
    });

    return createdTeachers;
  } catch (error) {
    console.error("❌ Error seeding teachers:", error);
    throw error;
  }
} 