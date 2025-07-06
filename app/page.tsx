'use client';

import { motion } from 'framer-motion';
import { TrendingUp, PieChart, BarChart3, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-emerald-400" />,
      title: "Smart Analytics",
      description: "Track your spending patterns with advanced data visualization and insights."
    },
    {
      icon: <PieChart className="h-8 w-8 text-blue-400" />,
      title: "Category Breakdown",
      description: "See exactly where your money goes with detailed category analysis."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-400" />,
      title: "Trend Analysis",
      description: "Monitor your financial trends over time with interactive charts."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-yellow-400" />,
      title: "Budget Tracking",
      description: "Set budgets and track your progress towards financial goals."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Personal Finance
            <span className="text-emerald-400 block">Visualizer</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take control of your finances with beautiful visualizations, smart analytics, 
            and comprehensive transaction management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/transactions">
              <Button size="lg" variant="outline" className="glass-hover text-lg px-8">
                View Transactions
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass h-full hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-white/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="glass max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Beautiful Dashboard
              </CardTitle>
              <p className="text-muted-foreground">
                Experience your financial data like never before with our intuitive dashboard
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">$12,450</div>
                  <div className="text-sm text-muted-foreground">Monthly Income</div>
                </div>
                <div className="glass p-6 rounded-lg">
                  <div className="text-3xl font-bold text-red-400 mb-2">$8,230</div>
                  <div className="text-sm text-muted-foreground">Monthly Expenses</div>
                </div>
                <div className="glass p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400 mb-2">$4,220</div>
                  <div className="text-sm text-muted-foreground">Net Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already taken control of their financial future.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 animate-pulse-glow">
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
