'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Plus, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SummaryCard from './components/SummaryCard';
import ExpenseBarChart from './components/ExpenseBarChart';
import CategoryPieChart from './components/CategoryPieChart';
import BudgetRadarChart from './components/BudgetRadarChart';
import SpendingInsights from './components/SpendingInsights';
import Link from 'next/link';
import { useState } from 'react';

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', selectedMonth, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams({
        month: selectedMonth.toString(),
        year: selectedYear.toString(),
      });
      const response = await fetch(`/api/dashboard?${params}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
        <Card className="glass p-8 text-center">
          <p className="text-red-400 mb-4">Error loading dashboard data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  const { summary, topCategories, recentTransactions, monthlyTrends, categoryBreakdown, budgetComparison } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Month/Year Selector */}
        <div className="flex gap-4 mb-4">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="p-2 rounded bg-background text-foreground border border-input"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="p-2 rounded bg-background text-foreground border border-input"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Financial Dashboard
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/budgets">
              <Button variant="outline" className="glass-hover">
                Manage Budgets
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="outline" className="glass-hover">
                View Transactions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/transactions">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Income"
            amount={summary?.totalIncome || 0}
            type="income"
            index={0}
          />
          <SummaryCard
            title="Total Expenses"
            amount={summary?.totalExpenses || 0}
            type="expense"
            index={1}
          />
          <SummaryCard
            title="Net Income"
            amount={summary?.netIncome || 0}
            type="net"
            index={2}
          />
          <SummaryCard
            title="Transactions"
            amount={summary?.transactionCount || 0}
            type="transactions"
            index={3}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monthlyTrends && <ExpenseBarChart data={monthlyTrends} />}
          {categoryBreakdown && <CategoryPieChart data={categoryBreakdown} />}
          {budgetComparison && budgetComparison.length > 0 && (
            <BudgetRadarChart data={budgetComparison} />
          )}
        </div>

        {/* Insights */}
        {summary && budgetComparison && (
          <SpendingInsights summary={summary} budgetComparison={budgetComparison} />
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Top Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCategories?.map((category: any, index: number) => (
                  <div key={category.category} className="flex items-center justify-between p-3 glass-hover rounded-lg">
                    <span className="font-medium text-foreground">{category.category}</span>
                    <span className="text-emerald-400 font-semibold">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {(!topCategories || topCategories.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No expense data available
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions?.map((transaction: any, index: number) => (
                    <div key={transaction._id} className="transaction-row">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!recentTransactions || recentTransactions.length === 0) && (
                    <p className="text-muted-foreground text-center py-8">
                      No recent transactions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;