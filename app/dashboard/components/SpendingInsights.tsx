'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpendingInsightsProps {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
  };
  budgetComparison: Array<{
    category: string;
    budget: number;
    actual: number;
    remaining: number;
  }>;
}

const SpendingInsights = ({ summary, budgetComparison }: SpendingInsightsProps) => {
  const { totalIncome, totalExpenses, netIncome } = summary;
  
  // Calculate insights
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
  // Find categories over budget
  const overBudgetCategories = budgetComparison.filter(item => item.remaining < 0);
  const underBudgetCategories = budgetComparison.filter(item => item.remaining > 0);
  
  // Generate insights
  const insights = [];
  
  if (savingsRate >= 20) {
    insights.push({
      type: 'positive',
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: 'Excellent Savings Rate',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. Great job!`
    });
  } else if (savingsRate >= 10) {
    insights.push({
      type: 'positive',
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: 'Good Savings Rate',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% for better financial health.`
    });
  } else if (savingsRate < 0) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
      title: 'Spending More Than Income',
      message: 'You\'re spending more than you earn. Consider reducing expenses or increasing income.'
    });
  } else {
    insights.push({
      type: 'warning',
      icon: <TrendingDown className="h-5 w-5 text-yellow-400" />,
      title: 'Low Savings Rate',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for at least 10-20% for better financial security.`
    });
  }
  
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      title: 'Over Budget Categories',
      message: `${overBudgetCategories.length} category${overBudgetCategories.length > 1 ? 'ies are' : ' is'} over budget. Review your spending in these areas.`
    });
  }
  
  if (underBudgetCategories.length > 0 && overBudgetCategories.length === 0) {
    insights.push({
      type: 'positive',
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: 'Great Budget Management',
      message: 'All categories are within budget! Keep up the excellent financial discipline.'
    });
  }
  
  if (expenseRatio > 90) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      title: 'High Expense Ratio',
      message: `You're spending ${expenseRatio.toFixed(1)}% of your income. Consider reducing expenses to improve savings.`
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === 'positive' 
                    ? 'border-emerald-500/20 bg-emerald-500/10' 
                    : 'border-yellow-500/20 bg-yellow-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {insight.icon}
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Add more transactions and budgets to get personalized insights
              </p>
            </div>
          )}
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {savingsRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Savings Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {expenseRatio.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Expense Ratio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpendingInsights; 