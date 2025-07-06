import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString()) + 1;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Use default user ID for demo purposes
    const defaultUserId = 'demo-user-id';
    
    // Get current month transactions
    const transactions = await Transaction.find({
      userId: defaultUserId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    
    // Get budgets for current month
    const budgets = await Budget.find({ userId: defaultUserId, month, year });
    
    // Calculate summary statistics
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netIncome = totalIncome - totalExpenses;
    
    // Category breakdown
    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Top 3 categories
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));
    
    // Recent transactions
    const recentTransactions = transactions.slice(0, 5);
    
    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const trendMonth = new Date(year, month - 1 - i, 1);
      const trendStartDate = new Date(trendMonth.getFullYear(), trendMonth.getMonth(), 1);
      const trendEndDate = new Date(trendMonth.getFullYear(), trendMonth.getMonth() + 1, 0);
      
      const monthTransactions = await Transaction.find({
        userId: defaultUserId,
        date: { $gte: trendStartDate, $lte: trendEndDate }
      });
      
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyTrends.push({
        month: trendMonth.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthExpenses
      });
    }
    
    // Budget vs actual
    const budgetComparison = budgets.map(budget => {
      const actualSpent = categoryBreakdown[budget.category] || 0;
      return {
        category: budget.category,
        budget: budget.budgetAmount,
        actual: actualSpent,
        remaining: budget.budgetAmount - actualSpent
      };
    });
    
    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        transactionCount: transactions.length
      },
      topCategories,
      recentTransactions,
      monthlyTrends,
      categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
      budgetComparison
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}