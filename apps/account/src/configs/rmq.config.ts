import { IRMQServiceAsyncOptions } from 'nestjs-rmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      exchangeName: configService.get<string>('AMQP_EXCHANGE') ?? '',
      connections: [{
        login: configService.get<string>('AMQP_USER') ?? '',
        password: configService.get<string>('AMQP_PASSWORD') ?? '',
        host: configService.get<string>('AMQP_HOSTNAME') ?? '',
      }],
      queueName: configService.get<string>('AMQP_QUEUE') ?? '',
      prefetchCount: 32,
      serviceName: 'service_account'
    })
})
