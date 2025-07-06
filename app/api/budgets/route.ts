import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    // Use default user ID for demo purposes
    const defaultUserId = 'demo-user-id';
    
    let query: any = { userId: defaultUserId };
    
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    
    const budgets = await Budget.find(query);
    
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    // Add default user ID for demo purposes
    const budgetData = { ...data, userId: 'demo-user-id' };
    const budget = new Budget(budgetData);
    await budget.save();
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create budget' 
    }, { status: 400 });
  }
}