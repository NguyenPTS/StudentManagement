import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    mssv: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    class: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
