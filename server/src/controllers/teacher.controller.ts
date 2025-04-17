import { Request, Response } from 'express';
import Teacher from '../models/teacher.model';
import User from '../models/user.model';
import { Class } from '../models/class.model';
import mongoose from 'mongoose';
import { Types } from 'mongoose';

// Get all teachers with filters
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const {
      status,
      subject,
      specialization,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query: any = {};
    
    // Add filters
    if (status) query.status = status;
    if (subject) query.subjects = subject;
    if (specialization) query.specialization = specialization;
    if (search) {
      query.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { subjects: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const teachers = await Teacher.find(query)
      .populate('user', 'name email')
      .populate('classes', 'name code')
      .sort({ [sortBy as string]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Teacher.countDocuments(query);

    res.json({
      teachers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error in getAllTeachers:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách giáo viên', error });
  }
};

// Get teacher by ID
export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in getTeacherById:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new teacher
export const createTeacher = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user: userData, ...teacherData } = req.body;

    // Create user first
    const user = new User({
      ...userData,
      role: 'teacher',
    });
    await user.save({ session });

    // Create teacher profile
    const teacher = new Teacher({
      ...teacherData,
      user: user._id,
    });
    await teacher.save({ session });

    await session.commitTransaction();
    
    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate('user', 'name email')
      .populate('classes', 'name code');

    res.status(201).json(populatedTeacher);
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in createTeacher:', error);
    res.status(500).json({ message: 'Lỗi khi tạo giáo viên mới', error });
  } finally {
    session.endSession();
  }
};

// Update teacher
export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const teacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in updateTeacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete teacher
export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTeacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get teacher's classes
export const getTeacherClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const teacher = await Teacher.findById(id).populate('classes');
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json(teacher.classes);
  } catch (error) {
    console.error('Error in getTeacherClasses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update teacher status
export const updateTeacherStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in updateTeacherStatus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add class to teacher
export const addTeacherClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { classId } = req.body;

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $addToSet: { classes: classId } },
      { new: true }
    ).populate('classes');

    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in addTeacherClass:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove class from teacher
export const removeTeacherClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, classId } = req.params;

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $pull: { classes: classId } },
      { new: true }
    ).populate('classes');

    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in removeTeacherClass:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add teacher rating
export const addTeacherRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      res.status(400).json({ message: 'Rating must be a number between 0 and 5' });
      return;
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    teacher.addRating(rating);
    await teacher.save();

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in addTeacherRating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get teacher statistics
export const getTeacherStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const teacher = await Teacher.findById(id).populate('classes');
    if (!teacher) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    const stats = {
      totalClasses: teacher.classes.length,
      rating: teacher.rating,
      totalRatings: teacher.totalRatings,
      averageRating: teacher.calculateAverageRating(),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getTeacherStats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherClasses,
  updateTeacherStatus,
  addTeacherClass,
  removeTeacherClass,
  addTeacherRating,
  getTeacherStats,
}; 