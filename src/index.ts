import mongoose from 'mongoose';
import assert from 'assert';
import {
  DBDepositTransaction,
  DBWallet2WalletTransferTransaction,
  DBWithdrawalTransaction,
  TransactionModel
} from './transaction/transaction.model.js';
import {
  mockedDepositTransaction,
  mockedWallet2walletTransaction,
  mockedWithdrawalTransaction
} from './transaction/transaction.mock.js';
import {
  DepositTransaction,
  TransactionType,
  Wallet2WalletTransferTransaction,
  WithdrawalTransaction
} from './transaction/transaction.types.js';

const connectToDB = async () => {
  const uri = 'mongodb://demo-user:1234@localhost:27017/discriminator-demo';
  const options = {
    directConnection: true,
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
  await mongoose.connect(uri, options);
  console.log('Connected to MongoDB');
};

const disconnectFromDB = async () => {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

const populate = async () => {
  const transactions = await TransactionModel.find().exec();
  if (transactions.length > 0) return;
  const w2w = new DBWallet2WalletTransferTransaction(mockedWallet2walletTransaction());
  const deposit = new DBDepositTransaction(mockedDepositTransaction());
  const withdrawal = new DBWithdrawalTransaction(mockedWithdrawalTransaction());
  await Promise.all([w2w.save(), deposit.save(), withdrawal.save()]);
};

const main = async () => {
  await connectToDB();
  await populate();
  const transactions = await TransactionModel.find().exec();
  assert(transactions.length === 3);
  const transfers = await TransactionModel.find({type: TransactionType.W2W_TRANSFER}).exec();
  const deposits = await TransactionModel.find({type: TransactionType.DEPOSIT}).exec();
  const withdrawals = await TransactionModel.find({type: TransactionType.WITHDRAWAL}).exec();

  // polymorphism: accessing the fields from Transaction interface
  assert(transfers[0].description === mockedWallet2walletTransaction().description);
  assert(deposits[0].description === mockedDepositTransaction().description);
  assert(withdrawals[0].description === mockedWithdrawalTransaction().description);

  // type casting to access transaction type specific fields
  const transfer = (transfers[0].toJSON() as Wallet2WalletTransferTransaction);
  const deposit = (deposits[0].toJSON() as DepositTransaction);
  const withdrawal = (withdrawals[0].toJSON() as WithdrawalTransaction);
  assert(transfer.destinationEWalletId === mockedWallet2walletTransaction().destinationEWalletId);
  assert(deposit.source === mockedDepositTransaction().source);
  assert(withdrawal.destination === mockedWithdrawalTransaction().destination);
  console.log('success');
  await disconnectFromDB();
};

await main();