import mongoose from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "";

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@studentmanagement.com" });
    if (existingAdmin) {
      console.log("❌ Admin account already exists");
      process.exit(1);
    }

    // Create admin account
    const hashedPassword = await bcrypt.hash("", 10);
    const admin = new User({
      email: "admin@studentmanagement.com",
      password: hashedPassword,
      role: "admin",
      status: "active"
    });

    await admin.save();
    console.log("✅ Admin account created successfully");
    console.log("Email: admin@studentmanagement.com");
    console.log("Password: vi");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin(); 