'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBudgets, useAddBudget, useUpdateBudget } from '@/hooks/useBudgets';
import { IBudget } from '@/models/Budget';
import Link from 'next/link';
import { toast } from 'sonner';

const BudgetForm = ({ budget, onSuccess, onCancel }: { 
  budget?: IBudget; 
  onSuccess: () => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    budgetAmount: budget?.budgetAmount || 0,
    month: budget?.month || new Date().getMonth() + 1,
    year: budget?.year || new Date().getFullYear(),
  });

  const addBudget = useAddBudget();
  const updateBudget = useUpdateBudget();

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Health & Fitness',
    'Education',
    'Bills & Utilities',
    'Other'
  ];

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || formData.budgetAmount <= 0) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    try {
      if (budget) {
        await updateBudget.mutateAsync({ ...formData, _id: budget._id });
        toast.success('Budget updated successfully');
      } else {
        await addBudget.mutateAsync(formData);
        toast.success('Budget added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Budget Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.budgetAmount}
            onChange={(e) => setFormData({ ...formData, budgetAmount: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground"
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Month</label>
          <select
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground"
            required
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Year</label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground"
            required
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={addBudget.isPending || updateBudget.isPending}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {addBudget.isPending || updateBudget.isPending ? 'Saving...' : budget ? 'Update' : 'Add'} Budget
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const BudgetsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: budgets, isLoading } = useBudgets(selectedMonth, selectedYear);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEditBudget = (budget: IBudget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="glass-hover">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
              <p className="text-muted-foreground">
                Set and manage your monthly category budgets
              </p>
            </div>
          </div>
          <Button onClick={handleAddBudget} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </motion.div>

        {/* Month/Year Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Filter by Month/Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budgets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="glass">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : budgets && budgets.length > 0 ? (
            budgets.map((budget: IBudget) => (
              <Card key={budget._id} className="glass hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{budget.category}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditBudget(budget)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">
                    ${budget.budgetAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {months.find(m => m.value === budget.month)?.label} {budget.year}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Budgets Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No budgets found for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                  </p>
                  <Button onClick={handleAddBudget} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Budget
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="glass border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm
              budget={editingBudget || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BudgetsPage; 