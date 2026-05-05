export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  accountNumber: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}
export interface Transaction {
  _id: string;
  senderId: { _id: string; name: string; accountNumber: string };
  receiverId: { _id: string; name: string; accountNumber: string };
  amount: number;
  type: "transfer" | "deposit" | "withdrawal";
  status: "completed" | "failed";
  description: string;
  createdAt: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}
export interface AuthData {
  user: User;
}
export interface SummaryData {
  balance: number;
  accountNumber: string;
  name: string;
  totalSent: number;
  totalReceived: number;
  totalDeposited: number;
  totalWithdrawn: number;
  recentTransactions: Transaction[];
}
export interface TransactionsData {
  transactions: Transaction[];
  total: number;
  page: number;
  pages: number;
}
export interface AdminStatsData {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalTransactions: number;
  totalVolume: number;
  totalBalances: number;
}
