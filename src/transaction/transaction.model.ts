import {Document, model, Schema} from 'mongoose';
import {
  Currency,
  DepositTransaction,
  Transaction,
  TransactionStatus,
  TransactionType,
  Wallet2WalletTransferTransaction,
  WithdrawalTransaction
} from './transaction.types.js';

const transform = (doc: any, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

const transactionSchema = new Schema<Transaction>(
  {
    eWalletAccountId: {type: String, required: true},
    amount: {type: Number, required: true},
    currency: {type: String, enum: Currency, required: true},
    status: {type: String, enum: TransactionStatus, required: true, default: TransactionStatus.PENDING},
    description: {type: String, required: true},
  },
  {
    _id: true,
    discriminatorKey: 'type',
    timestamps: {createdAt: 'timestamp', updatedAt: false},
    toJSON: {transform},
  }
);

type TransactionDocument = Transaction & Document;

export const TransactionModel = model<TransactionDocument>('Transaction', transactionSchema);

export const DBWallet2WalletTransferTransaction = TransactionModel.discriminator(
  TransactionType.W2W_TRANSFER,
  new Schema<Wallet2WalletTransferTransaction>({
    destinationEWalletId: {type: String, required: true},
    expiration: {type: Number, required: true, default: 14},
    fee: {type: Number, required: true, default: 0},
  })
);

export const DBDepositTransaction = TransactionModel.discriminator(
  TransactionType.DEPOSIT,
  new Schema<DepositTransaction>({
    referenceId: {type: String, required: true},
    source: {type: String, required: true}
  })
);

export const DBWithdrawalTransaction = TransactionModel.discriminator(
  TransactionType.WITHDRAWAL,
  new Schema<WithdrawalTransaction>({
    referenceId: {type: String, required: true},
    destination: {type: String, required: true}
  })
);
