import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, SummaryData, TransactionsData } from "@/types";
import type {
  TransferFormValues,
  DepositFormValues,
  WithdrawFormValues,
} from "@/lib/validation";

export const useSummary = () =>
  useQuery<SummaryData>({
    queryKey: ["summary"],
    queryFn: async () => {
      const data = await api.get<ApiResponse<SummaryData>>(
        "/transactions/summary",
      );
      return data.data!;
    },
  });

export const useTransactions = (page = 1) =>
  useQuery<TransactionsData>({
    queryKey: ["transactions", page],
    queryFn: async () => {
      const data = await api.get<ApiResponse<TransactionsData>>(
        `/transactions?page=${page}&limit=10`,
      );
      return data.data!;
    },
  });

export const useTransfer = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, TransferFormValues>({
    mutationFn: (v) => api.post<ApiResponse>("/transactions/transfer", v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useDeposit = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, DepositFormValues>({
    mutationFn: (v) => api.post<ApiResponse>("/transactions/deposit", v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useWithdraw = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, WithdrawFormValues>({
    mutationFn: (v) => api.post<ApiResponse>("/transactions/withdraw", v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["summary"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
