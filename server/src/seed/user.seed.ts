import mongoose from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export async function seedUsers() {
  try {
    // Create sample users
    const users = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        status: "active",
      },
      {
        name: "John Smith",
        email: "john.smith@example.com",
        password: await bcrypt.hash("teacher123", 10),
        role: "teacher",
        status: "active",
      },
      {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: await bcrypt.hash("teacher123", 10),
        role: "teacher",
        status: "active",
      },
      {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        password: await bcrypt.hash("teacher123", 10),
        role: "teacher",
        status: "active",
      },
    ];

    // Delete all existing users
    await User.deleteMany({});

    // Add new users
    const createdUsers = await User.insertMany(users);

    console.log("✅ Users seeded successfully:");
    createdUsers.forEach((user) => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}
