import {afterAll, afterEach, beforeAll, describe, expect, test} from 'vitest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import {
  DBDepositTransaction,
  DBWallet2WalletTransferTransaction,
  DBWithdrawalTransaction,
  TransactionModel
} from './transaction.model.js';
import {
  mockedDepositTransaction,
  mockedWallet2walletTransaction,
  mockedWithdrawalTransaction
} from './transaction.mock.js';
import {
  DepositTransaction,
  TransactionType,
  Wallet2WalletTransferTransaction,
  WithdrawalTransaction
} from './transaction.types.js';

describe('Mongoose Discriminator - Transactions', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    await mongoose.connection.dropCollection('transactions');
  });

  const populate = async () => {
    const w2w = new DBWallet2WalletTransferTransaction(mockedWallet2walletTransaction());
    const deposit = new DBDepositTransaction(mockedDepositTransaction());
    const withdrawal = new DBWithdrawalTransaction(mockedWithdrawalTransaction());
    await Promise.all([w2w.save(), deposit.save(), withdrawal.save()]);
  };

  test('should create multiple transactions', async () => {
    await populate();
    const transactions = await TransactionModel.find().exec();
    expect(transactions.length).eq(3);
    const transfers = await TransactionModel.find({type: TransactionType.W2W_TRANSFER}).exec();
    const deposits = await TransactionModel.find({type: TransactionType.DEPOSIT}).exec();
    const withdrawals = await TransactionModel.find({type: TransactionType.WITHDRAWAL}).exec();

    // polymorphism: accessing the fields from Transaction interface
    expect(transfers[0].description).eq(mockedWallet2walletTransaction().description);
    expect(deposits[0].description).eq(mockedDepositTransaction().description);
    expect(withdrawals[0].description).eq(mockedWithdrawalTransaction().description);

    // type casting to access transaction type specific fields
    const transfer = (transfers[0].toJSON() as Wallet2WalletTransferTransaction);
    const deposit = (deposits[0].toJSON() as DepositTransaction);
    const withdrawal = (withdrawals[0].toJSON() as WithdrawalTransaction);
    expect(transfer.destinationEWalletId).eq(mockedWallet2walletTransaction().destinationEWalletId);
    expect(deposit.source).eq(mockedDepositTransaction().source);
    expect(withdrawal.destination).eq(mockedWithdrawalTransaction().destination);
  });
});
