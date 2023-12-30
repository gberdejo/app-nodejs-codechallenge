import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from './entities/transaction-status.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionStatus, Transaction, TransactionType]),
    ClientsModule.register([
      {
        transport: Transport.KAFKA,
        name: 'ANTI_FRAUD_SERVICE',
        options: {
          client: {
            clientId: 'transaction-producer',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-group',
          },
        },
      },
    ]),
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
