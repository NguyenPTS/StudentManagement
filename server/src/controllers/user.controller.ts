import { Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Status } from "../models/user.model";

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { role, status } = req.query;
    const filter: any = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "Người dùng không tồn tại" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const createUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, role, name, status } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email đã tồn tại" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      name,
      status: status || "active",
    });

    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log("=== Update User ===");
  console.log("1. Request details:", {
    params: req.params,
    body: req.body,
    user: req.user,
  });

  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    console.log("2. Finding user with ID:", id);
    const user = await User.findById(id);
    console.log("3. Found user:", user);

    if (!user) {
      console.log("4. User not found");
      res.status(404).json({ message: "Người dùng không tồn tại" });
      return;
    }

    console.log("5. Current user data:", {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Nếu chỉ có status được gửi lên, chỉ cập nhật status
    if (Object.keys(req.body).length === 1 && status) {
      console.log("6. Updating only status:", { status });
      if (!["active", "inactive", "blocked"].includes(status)) {
        console.log("7. Invalid status:", status);
        res.status(400).json({ message: "Trạng thái không hợp lệ" });
        return;
      }
      
      // Sử dụng findByIdAndUpdate thay vì save() để tránh validation toàn bộ document
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { status: status as Status },
        { new: true, runValidators: false }
      ).select("-password");
      
      console.log("8. Status updated successfully");
      res.json(updatedUser);
      return;
    }

    // Nếu có các trường khác, kiểm tra và cập nhật
    console.log("9. Updating with new data:", {
      name,
      email,
      role,
      status,
    });

    // Kiểm tra email trùng lặp nếu có thay đổi email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("10. Email already exists");
        res.status(400).json({ message: "Email đã tồn tại" });
        return;
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) {
      if (!["active", "inactive", "blocked"].includes(status)) {
        console.log("11. Invalid status:", status);
        res.status(400).json({ message: "Trạng thái không hợp lệ" });
        return;
      }
      user.status = status as Status;
    }

    console.log("12. Saving updated user...");
    await user.save();
    console.log("13. User saved successfully");

    const { password: _, ...userResponse } = user.toObject();
    console.log("14. Sending response:", userResponse);

    res.json(userResponse);
  } catch (error) {
    console.error("15. Error updating user:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Error',
    });
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Người dùng không tồn tại" });
      return;
    }
    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
