import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  KafkaRetriableException,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller('anti-fraud')
export class AntiFraudController {
  @MessagePattern('transactionValidation')
  async create(
    @Payload() validateAntiFraudDto: any,
    @Ctx() context: KafkaContext,
  ) {
    console.log(validateAntiFraudDto);
    console.log(`Topic: ${context.getTopic()}`);
    console.log(`El tiempo> ${Date().toString()}`);

    throw new KafkaRetriableException(`${Date().toString()}`);

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();

    const consumer = context.getConsumer();

    await consumer.commitOffsets([{ topic, partition, offset }]);
  }
}
