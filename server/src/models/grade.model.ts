import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface IGrade extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  assignments: IAssignment[];
  finalGrade?: number;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  name: {
    type: String,
    required: [true, 'Assignment name is required'],
    trim: true,
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative'],
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: [0, 'Maximum score cannot be negative'],
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative'],
    max: [1, 'Weight cannot be greater than 1'],
  },
});

const gradeSchema = new Schema<IGrade>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class ID is required'],
    },
    assignments: [assignmentSchema],
    finalGrade: {
      type: Number,
      min: [0, 'Final grade cannot be negative'],
      max: [10, 'Final grade cannot be greater than 10'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
gradeSchema.index({ studentId: 1, classId: 1 }, { unique: true });
gradeSchema.index({ classId: 1 });

// Virtual for calculating weighted average grade
gradeSchema.virtual('calculatedGrade').get(function(this: IGrade) {
  if (!this.assignments.length) return null;

  const totalWeight = this.assignments.reduce((sum, assignment) => sum + assignment.weight, 0);
  if (totalWeight === 0) return null;

  const weightedSum = this.assignments.reduce((sum, assignment) => {
    const percentage = assignment.score / assignment.maxScore;
    return sum + (percentage * assignment.weight);
  }, 0);

  return (weightedSum / totalWeight) * 10; // Scale to 10-point system
});

// Pre-save middleware to update finalGrade
gradeSchema.pre('save', function(next) {
  const calculatedGrade = this.get('calculatedGrade');
  if (calculatedGrade !== null) {
    this.finalGrade = Number(calculatedGrade.toFixed(2));
  }
  next();
});

const Grade = mongoose.model<IGrade>('Grade', gradeSchema);

export default Grade; 