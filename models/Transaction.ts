import mongoose from 'mongoose';

export interface ITransaction {
  _id?: string;
  userId: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
  type: 'income' | 'expense';
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(v: Date) {
        return v <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
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
      'Income',
      'Savings',
      'Other'
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
  },
}, {
  timestamps: true,
});

// Index for efficient querying
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);