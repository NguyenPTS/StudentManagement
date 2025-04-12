import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    mssv: {
      type: String,
      required: [true, "Mã số sinh viên là bắt buộc"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Ngày sinh là bắt buộc"],
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    class: {
      type: String,
      required: [true, "Lớp là bắt buộc"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"],
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Thêm index cho các trường thường được tìm kiếm
studentSchema.index({ mssv: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ class: 1 });

export default mongoose.model("Student", studentSchema);
