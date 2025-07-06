import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const defaultUserId = 'demo-user-id';
    
    // Check if demo data already exists
    const existingTransactions = await Transaction.findOne({ userId: defaultUserId });
    if (existingTransactions) {
      return NextResponse.json({ 
        message: 'Demo data already exists',
        transactions: await Transaction.countDocuments({ userId: defaultUserId }),
        budgets: await Budget.countDocuments({ userId: defaultUserId })
      });
    }
    
    // Create demo transactions
    const demoTransactions = [
      {
        userId: defaultUserId,
        amount: 1200,
        date: new Date(2024, 11, 1),
        description: 'Salary',
        category: 'Income',
        type: 'income'
      },
      {
        userId: defaultUserId,
        amount: 85.50,
        date: new Date(2024, 11, 2),
        description: 'Grocery shopping',
        category: 'Food & Dining',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 45.00,
        date: new Date(2024, 11, 3),
        description: 'Gas station',
        category: 'Transportation',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 120.00,
        date: new Date(2024, 11, 4),
        description: 'Movie tickets',
        category: 'Entertainment',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 200.00,
        date: new Date(2024, 11, 5),
        description: 'Online shopping',
        category: 'Shopping',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 75.00,
        date: new Date(2024, 11, 6),
        description: 'Gym membership',
        category: 'Health & Fitness',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 150.00,
        date: new Date(2024, 11, 7),
        description: 'Electricity bill',
        category: 'Bills & Utilities',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 300.00,
        date: new Date(2024, 11, 8),
        description: 'Online course',
        category: 'Education',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 500.00,
        date: new Date(2024, 11, 9),
        description: 'Savings transfer',
        category: 'Savings',
        type: 'expense'
      },
      {
        userId: defaultUserId,
        amount: 65.00,
        date: new Date(2024, 11, 10),
        description: 'Restaurant dinner',
        category: 'Food & Dining',
        type: 'expense'
      }
    ];
    
    // Create demo budgets
    const demoBudgets = [
      {
        userId: defaultUserId,
        category: 'Food & Dining',
        budgetAmount: 400,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Transportation',
        budgetAmount: 200,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Entertainment',
        budgetAmount: 150,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Shopping',
        budgetAmount: 300,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Health & Fitness',
        budgetAmount: 100,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Bills & Utilities',
        budgetAmount: 250,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Education',
        budgetAmount: 200,
        month: 12,
        year: 2024
      },
      {
        userId: defaultUserId,
        category: 'Other',
        budgetAmount: 100,
        month: 12,
        year: 2024
      }
    ];
    
    // Insert demo data
    await Transaction.insertMany(demoTransactions);
    await Budget.insertMany(demoBudgets);
    
    return NextResponse.json({ 
      message: 'Demo data created successfully',
      transactions: demoTransactions.length,
      budgets: demoBudgets.length
    });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json({ error: 'Failed to seed demo data' }, { status: 500 });
  }
} 