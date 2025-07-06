import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/models/Budget';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const data = await request.json();
    // Add default user ID for demo purposes
    const budgetData = { ...data, userId: 'demo-user-id' };
    const budget = await Budget.findByIdAndUpdate(
      id,
      budgetData,
      { new: true, runValidators: true }
    );
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json(budget);
  } catch (error: any) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update budget' 
    }, { status: 400 });
  }
}