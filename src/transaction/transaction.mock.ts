import {DepositTransaction, Wallet2WalletTransferTransaction, WithdrawalTransaction} from './transaction.types.js';

export const mockedWallet2walletTransaction = (overrideValues?: any): Wallet2WalletTransferTransaction => ({
  eWalletAccountId: '1111111111111',
  amount: 10000,
  currency: 'USD',
  description: 'Some description for w2w transfer',
  destinationEWalletId: '11111',
  fee: 200,
  ...overrideValues,
});

export const mockedDepositTransaction = (overrideValues?: any): DepositTransaction => ({
  eWalletAccountId: '2222222222222',
  amount: 20000,
  currency: 'USD',
  description: 'Some description for deposit',
  referenceId: '22222',
  source: 'Source name',
  ...overrideValues,
});

export const mockedWithdrawalTransaction = (overrideValues?: any): WithdrawalTransaction => ({
  eWalletAccountId: '3333333333333',
  amount: 30000,
  currency: 'BRL',
  description: 'Some description for withdraw',
  referenceId: '3333',
  destination: 'Destination name',
  ...overrideValues,
});
