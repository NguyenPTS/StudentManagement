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
    console.log('Found user:', user);
    if (!user) {
      res.status(404).json({ message: "Tài khoản không tồn tại" });
      return;
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === "blocked" || user.status === "inactive") {
      res.status(403).json({ message: user.status === "blocked" ? "Tài khoản đã bị khóa" : "Tài khoản chưa được kích hoạt" });
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

    console.log('Response data:', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

    // Trả về thông tin người dùng và token
    const userResponse = {
      _id: user._id,
      name: user.name || 'Admin',
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    console.log('User response:', userResponse);
    res.status(200).json({
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};
