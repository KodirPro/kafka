import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaConsumer } from './kafka/kafka.consumer';

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [KafkaConsumer],
})
export class AppModule {}
