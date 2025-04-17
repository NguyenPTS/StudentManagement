import { Request, Response } from 'express';
import Grade, { IGrade } from '../models/grade.model';
import { Class, IClass } from '../models/class.model';
import mongoose, { Types } from 'mongoose';

interface GradeStatistics {
  totalStudents: number;
  activeStudents: number;
  averageGrade: number;
  excellentCount: number;    // 9.0-10
  goodCount: number;         // 8.0-8.9
  aboveAverageCount: number; // 7.0-7.9
  averageCount: number;      // 5.0-6.9
  belowAverageCount: number; // <5.0
}

export const createOrUpdateGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, classId, assignments } = req.body;

    // Validate IDs
    if (!Types.ObjectId.isValid(studentId) || !Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid student or class ID' });
      return;
    }

    // Check if class exists and student is enrolled
    const classDoc = await Class.findById(classId) as IClass;
    if (!classDoc) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }
    if (!classDoc.students.some(id => id.equals(new Types.ObjectId(studentId)))) {
      res.status(400).json({ message: 'Student is not enrolled in this class' });
      return;
    }

    // Create or update grade
    const grade = await Grade.findOneAndUpdate(
      { studentId, classId },
      { assignments },
      { new: true, upsert: true, runValidators: true }
    ) as IGrade & { _id: Types.ObjectId };

    // Update class grades array if it's a new grade
    if (!classDoc.grades.some(id => id.equals(grade._id))) {
      classDoc.grades.push(grade._id);
      await classDoc.save();
    }

    res.status(200).json(grade);
  } catch (error) {
    console.error('Error in createOrUpdateGrade:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid student or class ID' });
      return;
    }

    const grade = await Grade.findOne({ studentId, classId });
    if (!grade) {
      res.status(404).json({ message: 'Grade not found' });
      return;
    }

    res.status(200).json(grade);
  } catch (error) {
    console.error('Error in getStudentGrade:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClassGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid class ID' });
      return;
    }

    const grades = await Grade.find({ classId })
      .populate('studentId', 'name email mssv')
      .sort({ 'studentId.name': 1 });

    res.status(200).json(grades);
  } catch (error) {
    console.error('Error in getClassGrades:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClassStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid class ID' });
      return;
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    const grades = await Grade.find({ classId });

    const statistics: GradeStatistics = {
      totalStudents: classDoc.students.length,
      activeStudents: grades.length,
      averageGrade: 0,
      excellentCount: 0,
      goodCount: 0,
      aboveAverageCount: 0,
      averageCount: 0,
      belowAverageCount: 0,
    };

    if (grades.length > 0) {
      // Calculate average grade
      const totalGrade = grades.reduce((sum, grade) => sum + (grade.finalGrade || 0), 0);
      statistics.averageGrade = Number((totalGrade / grades.length).toFixed(2));

      // Calculate grade distribution
      grades.forEach(grade => {
        const finalGrade = grade.finalGrade || 0;
        if (finalGrade >= 9.0) statistics.excellentCount++;
        else if (finalGrade >= 8.0) statistics.goodCount++;
        else if (finalGrade >= 7.0) statistics.aboveAverageCount++;
        else if (finalGrade >= 5.0) statistics.averageCount++;
        else statistics.belowAverageCount++;
      });
    }

    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error in getClassStatistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(classId)) {
      res.status(400).json({ message: 'Invalid student or class ID' });
      return;
    }

    const grade = await Grade.findOneAndDelete({ studentId, classId });
    if (!grade) {
      res.status(404).json({ message: 'Grade not found' });
      return;
    }

    // Remove grade from class grades array
    await Class.findByIdAndUpdate(classId, {
      $pull: { grades: grade._id }
    });

    res.status(200).json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error in deleteGrade:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 