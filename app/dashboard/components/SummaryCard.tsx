'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'net' | 'transactions';
  change?: number;
  index: number;
}

const SummaryCard = ({ title, amount, type, change, index }: SummaryCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case 'expense':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'net':
        return <DollarSign className="h-5 w-5 text-blue-400" />;
      default:
        return <Activity className="h-5 w-5 text-purple-400" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'income':
        return 'border-emerald-500/20 bg-emerald-500/5';
      case 'expense':
        return 'border-red-500/20 bg-red-500/5';
      case 'net':
        return amount >= 0 ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-purple-500/20 bg-purple-500/5';
    }
  };

  const formatAmount = (value: number) => {
    if (type === 'transactions') {
      return value.toString();
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`summary-card ${getColorClasses()}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {getIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {type === 'net' && amount < 0 ? '-' : ''}
            {formatAmount(amount)}
          </div>
          {change !== undefined && (
            <p className={`text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;