import mongoose, { Document } from 'mongoose';
import Grade from '../models/grade.model';
import { IStudent } from '../models/student.model';
import { IClass } from '../models/class.model';

type StudentDocument = Document<unknown, {}, IStudent> & IStudent & { _id: mongoose.Types.ObjectId };
type ClassDocument = Document<unknown, {}, IClass> & IClass & { _id: mongoose.Types.ObjectId };

interface Assignment {
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
}

interface GradeAssignment {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
}

export const seedGrades = async (students: StudentDocument[], classes: ClassDocument[]) => {
  try {
    // For each student in each class, create random grades
    for (const student of students) {
      for (const classItem of classes) {
        // Check if student is in this class
        if (classItem.students.some(s => s.toString() === student._id.toString())) {
          // Create grades for each assignment in the class
          const assignments = (classItem as any).assignments?.map((assignment: Assignment): GradeAssignment => ({
            name: assignment.title,
            score: Math.floor(Math.random() * 30) + 70, // Random grade between 70-100
            maxScore: 100,
            weight: 1
          })) || [];

          // Create the grade document
          await Grade.create({
            studentId: student._id,
            classId: classItem._id,
            assignments,
            finalGrade: assignments.reduce((acc: number, curr: GradeAssignment) => acc + curr.score, 0) / (assignments.length || 1)
          });

          console.log(`Created grades for student ${student.name} in class ${classItem.name}`);
        }
      }
    }
    console.log('✅ Grades seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding grades:', error);
    throw error;
  }
}; 