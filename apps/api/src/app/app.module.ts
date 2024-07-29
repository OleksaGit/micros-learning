import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controller/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.api.env' }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const rmqConfig = getRMQConfig().useFactory(this.configService);
    console.log(await rmqConfig);

    const jwtConfig = getJwtConfig().useFactory(this.configService);
    console.log(await jwtConfig);
  }
}
