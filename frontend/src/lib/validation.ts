
export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface TransferFormValues {
  receiverAccountNumber: string;
  amount: number;
  description?: string;
}

export interface DepositFormValues {
  amount: number;
}

export interface WithdrawFormValues {
  amount: number;
}