import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IBudget } from '@/models/Budget';

export const useBudgets = (month?: number, year?: number) => {
  const queryKey = ['budgets', month, year];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      
      const response = await fetch(`/api/budgets?${params}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
  });
};

export const useAddBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (budget: Omit<IBudget, '_id'>) => {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error('Failed to add budget');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ _id, ...budget }: IBudget) => {
      const response = await fetch(`/api/budgets/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};