import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly antiFraudClient: ClientKafka,
  ) {}

  async create(createTransactionInput: CreateTransactionInput) {
    this.logger.log(createTransactionInput, TransactionsService.name);

    const transaction = this.transactionRepository.create(
      createTransactionInput,
    );

    this.logger.log(transaction, TransactionsService.name);

    transaction.transactionExternalId = v4();

    const status = await this.transactionStatusRepository.findOne({
      where: { id: 1 },
    });

    if (!status) throw new NotFoundException('Status Not Found');

    transaction.transactionStatusId = status.id;

    const type = await this.transactionTypeRepository.findOne({
      where: {
        id: createTransactionInput.tranferTypeId,
      },
    });

    if (!type) throw new NotFoundException('Type Not Found');

    transaction.transactionTypeId = createTransactionInput.tranferTypeId;

    await this.transactionRepository.save(transaction);

    this.logger.log(transaction, `${TransactionsService.name}.sendQueue`);

    this.antiFraudClient
      .emit(
        'transactionValidation',
        JSON.stringify({
          transactionExternalId: transaction.transactionExternalId,
          value: transaction.value,
        }),
      )
      .subscribe({
        error(err) {
          console.log(err);
        },
      });

    return transaction;
  }

  findAll() {
    return this.transactionRepository.find();
  }

  findAllByTransactionType(id: number) {
    return this.transactionRepository.find({
      where: { transactionTypeId: id },
    });
  }

  findOne(id: number) {
    return this.transactionRepository.findOne({ where: { id } });
  }

  findOneByTransactionId(transactionExternalId: string) {
    return this.transactionRepository.findOne({
      where: { transactionExternalId },
    });
  }

  async update(id: number, updateTransactionInput: UpdateTransactionInput) {
    this.logger.log(updateTransactionInput);

    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) throw new NotFoundException('Transaction Not Found');

    const bodyUpdate = Object.assign(transaction, updateTransactionInput);

    await this.transactionRepository.update({ id }, bodyUpdate);

    return bodyUpdate;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    if (!transaction) {
      throw new NotFoundException();
    }

    await this.transactionRepository.delete({ id: transaction.id });

    return transaction;
  }

  getTransactionTypeService(id: number) {
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  getTrasactionStatusService(id: number) {
    return this.transactionStatusRepository.findOne({ where: { id } });
  }
}
