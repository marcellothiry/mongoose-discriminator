export enum TransactionType {
  W2W_TRANSFER = 'wallet2wallet transfer',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum Currency {
  USD = 'USD',
  BRL = 'BRL'
}

export interface Transaction {
  id: string;
  eWalletAccountId: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  timestamp: Date;
  description: string;
  type: TransactionType;
}

export interface Wallet2WalletTransferTransaction extends Transaction {
  destinationEWalletId: string;
  expiration: number;
  fee: number;
}

export interface DepositTransaction extends Transaction {
  referenceId: string;
  source: string;
}

export interface WithdrawalTransaction extends Transaction {
  referenceId: string;
  destination: string;
}