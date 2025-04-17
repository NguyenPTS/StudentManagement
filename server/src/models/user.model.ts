import mongoose from "mongoose";

export type Role = "admin" | "teacher";
export type Status = "active" | "inactive" | "blocked";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = mongoose.Document<unknown, {}, IUser> & IUser;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên người dùng là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Vui lòng nhập email hợp lệ",
      ],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "teacher"],
        message: "Vai trò không hợp lệ",
      },
      default: "teacher",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "blocked"],
        message: "Trạng thái không hợp lệ",
      },
      default: "active",
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: new Date(),
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
