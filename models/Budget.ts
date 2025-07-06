import mongoose from 'mongoose';

export interface IBudget {
  _id?: string;
  userId: string;
  category: string;
  budgetAmount: number;
  month: number;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const budgetSchema = new mongoose.Schema<IBudget>({
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Health & Fitness',
      'Education',
      'Bills & Utilities',
      'Other'
    ],
  },
  budgetAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
  },
}, {
  timestamps: true,
});

// Ensure unique budget per user per category per month
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', budgetSchema);