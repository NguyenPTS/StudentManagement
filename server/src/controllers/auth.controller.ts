import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    res.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu" });
    return;
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(404).json({ message: "Tài khoản không tồn tại" });
      return;
    }

    // Check account status
    if (user.status === 'blocked') {
      res.status(403).json({ message: "Tài khoản đã bị khóa" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Sai mật khẩu" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
