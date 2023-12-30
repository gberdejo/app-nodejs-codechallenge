import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';

@Module({
  controllers: [AntiFraudController],
})
export class AntiFraudModule {}
