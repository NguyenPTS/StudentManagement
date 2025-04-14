import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import {
  generateResetToken,
  createResetPasswordUrl,
  sendResetPasswordEmail,
} from "../utils/email.utils";

// Gửi email đặt lại mật khẩu
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản với email này" });
      return;
    }

    // Tạo token và thời gian hết hạn
    const resetToken = generateResetToken();
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 giờ

    // Lưu token và thời gian hết hạn vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Tạo URL đặt lại mật khẩu
    const resetUrl = createResetPasswordUrl(resetToken);

    // Gửi email
    await sendResetPasswordEmail(user.email, resetUrl);

    res.status(200).json({
      message: "Email đặt lại mật khẩu đã được gửi",
    });
  } catch (error) {
    next(error);
  }
};

// Kiểm tra token
export const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
      return;
    }

    res.status(200).json({
      message: "Token hợp lệ",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
      return;
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = new Date();
    await user.save();

    res.status(200).json({
      message: "Mật khẩu đã được đặt lại thành công",
    });
  } catch (error) {
    next(error);
  }
};
