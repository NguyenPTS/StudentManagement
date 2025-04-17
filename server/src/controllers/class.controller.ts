import { Request, Response } from "express";
import { Class, IClass } from "../models/class.model";
import Student, { IStudent } from "../models/student.model";
import mongoose from "mongoose";

// Helper function to calculate average score
const calculateAverageScore = (scores: number[]): number => {
  if (!scores.length) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

// Helper function to calculate attendance rate
const calculateAttendanceRate = (attendance: { present: number; total: number }): number => {
  if (!attendance.total) return 0;
  return (attendance.present / attendance.total) * 100;
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const classes = await Class.find()
      .populate("teacher", "name email")
      .populate("students", "name email");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("students", "name email");
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching class", error });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const classData = await Class.findById(req.params.id).populate("students");
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(classData.students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate<{ students: IStudent[] }>("students")
      .populate("teacher", "name email");
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const stats = {
      totalStudents: classData.students.length,
      averageScore: calculateAverageScore(classData.students.map(student => student.averageScore || 0)),
      attendanceRate: calculateAttendanceRate({
        present: classData.students.reduce((sum, student) => sum + (student.attendance?.present || 0), 0),
        total: classData.students.reduce((sum, student) => sum + (student.attendance?.total || 0), 0),
      }),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching class statistics", error });
  }
};

export const create = async (req: Request & { user?: { _id: mongoose.Types.ObjectId } }, res: Response) => {
  try {
    const newClass = new Class({
      ...req.body,
      teacher: req.body.teacherId || req.user?._id,
      status: req.body.status || 'active'
    });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: "Error creating class", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: "Error updating class", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting class", error });
  }
};

export const addStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classData.students.includes(studentId)) {
      return res.status(400).json({ message: "Student already in class" });
    }

    if (classData.students.length >= classData.maxStudents) {
      return res.status(400).json({ message: "Class is full" });
    }

    classData.students.push(studentId);
    await classData.save();

    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Error adding student to class", error });
  }
};

export const removeStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    classData.students = classData.students.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== studentId
    );
    await classData.save();

    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Error removing student from class", error });
  }
};

const classController = {
  getAll,
  getById,
  getStudents,
  getStats,
  create,
  update,
  remove,
  addStudent,
  removeStudent
};

export default classController; 