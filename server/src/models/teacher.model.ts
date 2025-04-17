import mongoose, { Document, Schema } from 'mongoose';
import User, { Role, Status } from './user.model';
import { IClass } from './class.model';

export interface ITeacher extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string[];
  qualifications: string[];
  experience: number;
  subjects: string[];
  bio?: string;
  avatar?: string;
  contactNumber?: string;
  address?: string;
  classes: mongoose.Types.ObjectId[];
  rating: number;
  totalRatings: number;
  status: Status;
  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  schedule?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    class: mongoose.Types.ObjectId;
  }[];
  achievements?: {
    title: string;
    description: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  addRating(rating: number): void;
  calculateAverageRating(): number;
}

const teacherSchema = new Schema<ITeacher>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: [String],
      required: true,
      default: [],
    },
    qualifications: {
      type: [String],
      required: true,
      default: [],
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    subjects: {
      type: [String],
      required: true,
      default: [],
    },
    bio: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    classes: [{
      type: Schema.Types.ObjectId,
      ref: 'Class',
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
      required: true,
    },
    documents: [{
      type: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    schedule: [{
      dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
      },
    }],
    achievements: [{
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      date: {
        type: Date,
        required: true,
      },
    }],
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

// Indexes
teacherSchema.index({ user: 1 });
teacherSchema.index({ status: 1 });
teacherSchema.index({ subjects: 1 });
teacherSchema.index({ 'schedule.dayOfWeek': 1, 'schedule.startTime': 1 });

// Virtual for full name
teacherSchema.virtual('fullName').get(function(this: ITeacher) {
  return this.user ? `${(this.user as any).firstName} ${(this.user as any).lastName}` : '';
});

// Method to calculate average rating
teacherSchema.methods.calculateAverageRating = function() {
  if (this.totalRatings === 0) return 0;
  return this.rating / this.totalRatings;
};

// Method to add a new rating
teacherSchema.methods.addRating = function(rating: number) {
  this.rating = (this.rating * this.totalRatings + rating) / (this.totalRatings + 1);
  this.totalRatings += 1;
};

// Pre-save middleware
teacherSchema.pre('save', function(next) {
  // Ensure rating is between 0 and 5
  if (this.rating < 0) this.rating = 0;
  if (this.rating > 5) this.rating = 5;
  next();
});

const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);

export default Teacher;
