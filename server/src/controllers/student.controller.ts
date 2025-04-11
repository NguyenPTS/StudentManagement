import { Request, Response, NextFunction } from "express";
import Student from "../models/student.model";

export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

    const students = await Student.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.json(students);
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, mssv, class: classFilter, status } = req.body;

    const existingStudent = await Student.findOne({ mssv });
    if (existingStudent) {
      res.status(400).json({ message: "MSSV already exists" });
      return;
    }
    const student = new Student({
      name,
      mssv,
      class: classFilter,
      status,
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
