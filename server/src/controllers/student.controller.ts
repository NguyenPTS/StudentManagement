import { Request, Response, NextFunction } from "express";
import Student from "../models/student.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const getStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Get students request received');
    console.log('Request query:', req.query);
    console.log('Request headers:', req.headers);
    console.log('User from token:', req.user);

    const {
      name,
      mssv,
      class: classFilter,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    const filter: any = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (mssv) filter.mssv = mssv;
    if (classFilter) filter.class = classFilter;
    if (status) filter.status = status;

    console.log('MongoDB filter:', filter);
    const students = await Student.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit);
    console.log('Found students:', students);
    res.json(students);
  } catch (error) {
    console.error('Error in getStudents:', error);
    next(error);
  }
};

export const getStudentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Get student by id request received');
    console.log('Student ID:', req.params.id);
    console.log('Request headers:', req.headers);
    console.log('User from token:', req.user);

    const student = await Student.findById(req.params.id);
    console.log('Found student:', student);
    if (!student) {
      console.log('Student not found');
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json(student);
  } catch (error) {
    console.error('Error in getStudentById:', error);
    next(error);
  }
};

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      name, 
      mssv, 
      email,
      dob,
      class: classFilter, 
      phone,
      address,
      status = "active" 
    } = req.body;

    // Kiểm tra MSSV đã tồn tại chưa
    const existingStudent = await Student.findOne({ $or: [{ mssv }, { email }] });
    if (existingStudent) {
      res.status(400).json({ 
        message: existingStudent.mssv === mssv 
          ? "MSSV đã tồn tại" 
          : "Email đã tồn tại" 
      });
      return;
    }

    // Tạo sinh viên mới
    const student = new Student({
      name,
      mssv,
      email,
      dob: new Date(dob),
      class: classFilter,
      phone,
      address,
      status
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, mssv, class: classFilter, status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, mssv, class: classFilter, status },
      { new: true }
    );
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};
