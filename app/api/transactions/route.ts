import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    
    // Use default user ID for demo purposes
    const defaultUserId = 'demo-user-id';
    
    let query: any = { userId: defaultUserId };
    
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (category) query.category = category;
    if (type) query.type = type;
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    // Add default user ID for demo purposes
    const transactionData = { ...data, userId: 'demo-user-id' };
    const transaction = new Transaction(transactionData);
    await transaction.save();
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create transaction' 
    }, { status: 400 });
  }
}