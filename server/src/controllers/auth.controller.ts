import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Tài khoản không tồn tại" });
      return;
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === "blocked") {
      res.status(403).json({ message: "Tài khoản đã bị khóa" });
      return;
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Mật khẩu không đúng" });
      return;
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Trả về thông tin người dùng và token
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
