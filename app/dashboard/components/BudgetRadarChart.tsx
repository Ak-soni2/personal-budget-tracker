'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface BudgetRadarChartProps {
  data: Array<{
    category: string;
    budget: number;
    actual: number;
    remaining: number;
  }>;
}

const BudgetRadarChart = ({ data }: BudgetRadarChartProps) => {
  const radarData = data.map(item => ({
    category: item.category.split(' ')[0], // Shorten category names
    budgetPercent: 100,
    actualPercent: item.budget > 0 ? (item.actual / item.budget) * 100 : 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budgetItem = data.find(item => item.category.startsWith(label));
      return (
        <div className="glass p-3 rounded-lg border border-white/20">
          <p className="text-sm font-medium text-foreground">{budgetItem?.category}</p>
          <p className="text-sm text-blue-400">
            Budget: ${budgetItem?.budget.toLocaleString()}
          </p>
          <p className="text-sm text-emerald-400">
            Actual: ${budgetItem?.actual.toLocaleString()}
          </p>
          <p className="text-sm text-yellow-400">
            Remaining: ${budgetItem?.remaining.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Budget vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                domain={[0, 100]}
              />
              <Radar
                name="Budget"
                dataKey="budgetPercent"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Actual"
                dataKey="actualPercent"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BudgetRadarChart;