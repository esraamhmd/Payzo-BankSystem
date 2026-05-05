import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, AdminStatsData, User, Transaction } from '@/types';

export const useAdminStats = () =>
  useQuery<AdminStatsData>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const data = await api.get<ApiResponse<AdminStatsData>>('/admin/stats');
      return data.data!;
    },
  });

export const useAdminUsers = () =>
  useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const data = await api.get<ApiResponse<{ users: User[] }>>('/admin/users');
      return data.data!.users;
    },
  });

export const useAdminTransactions = () =>
  useQuery<Transaction[]>({
    queryKey: ['admin', 'transactions'],
    queryFn: async () => {
      const data = await api.get<ApiResponse<{ transactions: Transaction[] }>>('/admin/transactions');
      return data.data!.transactions;
    },
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, { id: string; isActive?: boolean; role?: string }>({
    mutationFn: ({ id, ...body }) => api.put<ApiResponse>(`/admin/users/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin'] }); },
  });
};