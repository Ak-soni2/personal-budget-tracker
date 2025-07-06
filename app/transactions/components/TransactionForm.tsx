'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAddTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { ITransaction } from '@/models/Transaction';

const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(val => parseFloat(val) > 0, 'Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: ITransaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Health & Fitness',
  'Education',
  'Bills & Utilities',
  'Income',
  'Savings',
  'Other'
];

const TransactionForm = ({ transaction, onSuccess, onCancel }: TransactionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTransaction = useAddTransaction();
  const updateTransaction = useUpdateTransaction();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? {
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split('T')[0],
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
    } : {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const watchedType = watch('type');

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true);
      
      const transactionData = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
      };

      if (transaction) {
        await updateTransaction.mutateAsync({ ...transactionData, _id: transaction._id, userId: 'demo-user-id' });
        toast.success('Transaction updated successfully');
      } else {
        await addTransaction.mutateAsync({ ...transactionData, userId: 'demo-user-id' });
        toast.success('Transaction added successfully');
      }
      
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setValue('type', value as 'income' | 'expense')}>
                <SelectTrigger className="glass-hover">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-400 text-sm">{errors.type.message}</p>}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="glass-hover"
                {...register('amount')}
              />
              {errors.amount && <p className="text-red-400 text-sm">{errors.amount.message}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className="glass-hover"
                {...register('date')}
              />
              {errors.date && <p className="text-red-400 text-sm">{errors.date.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter transaction description"
                className="glass-hover"
                {...register('description')}
              />
              {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger className="glass-hover">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(cat => watchedType === 'income' ? ['Income', 'Savings'].includes(cat) : !['Income', 'Savings'].includes(cat))
                    .map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-400 text-sm">{errors.category.message}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Saving...' : transaction ? 'Update' : 'Add'} Transaction
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="glass-hover">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionForm;