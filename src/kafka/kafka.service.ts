import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, Kafka, logLevel } from 'kafkajs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KafkaService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: ['91.212.89.166:9092'],
    clientId: 'HET Buxgalteriya',
    ssl: false,
    sasl: {
      mechanism: 'plain',
      username: 'hetbuxgalteriya',
      password: 'hetBuxgalteriyaKaznacheystvo',
    },
  });

  private readonly consumers: Consumer[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  async runConsumer() {
    // for (let index = 0; index < 10; index++) {
    // await this.createTableJSON('aaasdasd ' + index);
    // }
    const consumer = this.kafka.consumer({ groupId: 'HET_TREASURY_GR5' });
    await consumer.connect();
    await consumer.subscribe({
      topics: ['HET_TREASURY_2023_ALL'],
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ message: { value, offset } }) => {
        console.log(offset);
        //        await this.createTableJSON(value.toString());
        this.createTableJSON(value.toString());
      },
    });
    this.consumers.push(consumer);
  }

  async createTableJSON(textinfo: string) {
    try {
      return await this.prismaService.tableJSON.create({ data: { textinfo } });
    } catch (error) {
      for (const consumer of this.consumers) {
        await consumer.disconnect();
      }
      throw error;
    }
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
