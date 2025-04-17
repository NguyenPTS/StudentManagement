import mongoose, { Document, Schema } from "mongoose";

export interface IClass extends Document {
  name: string;
  code: string;
  description?: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  grades: mongoose.Types.ObjectId[];
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  maxStudents: number;
  status: "active" | "inactive";
  academicYear: string;
  semester: number;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: "Student",
    }],
    grades: [{
      type: Schema.Types.ObjectId,
      ref: "Grade",
    }],
    schedule: [{
      dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    }],
    maxStudents: {
      type: Number,
      required: true,
      default: 30,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
classSchema.index({ name: 1 });
classSchema.index({ teacher: 1 });
classSchema.index({ academicYear: 1, semester: 1 });

export const Class = mongoose.model<IClass>("Class", classSchema);