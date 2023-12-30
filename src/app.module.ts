import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { AppConfig, DatabaseConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (error?.extensions?.originalError as string) || error.message,
        };
        return graphQLFormattedError;
      },
    }),
    TransactionsModule,
    AntiFraudModule,
  ],
})
export class AppModule {}
