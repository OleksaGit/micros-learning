import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { UserModule } from './user.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { AccountLogin, AccountRegister, AccountUserInfo } from '@micros-learning/contracts';
import { verify } from 'jsonwebtoken';

const authLogin: AccountLogin.Request = {
  email: 'a@a.ua',
  password: '1'
}

const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: 'Вася'
}

describe('UserController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let configService: ConfigService;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env'}),
        RMQModule.forTest({}),
        UserModule,
        AuthModule,
        MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/micros?authSource=admin')
      ]
    }).compile();
    app = module.createNestApplication();
    await app.init();

    userRepository = app.get(UserRepository);
    rmqService = app.get(RMQService);
    configService = app.get(ConfigService);

    await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(
      AccountRegister.topic,
      authRegister
    );
    const { access_token } = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
      AccountLogin.topic,
      authLogin
    );
    token = access_token
    const data = verify(token, configService.get('JWT_SECRET'))
    userId = data['id']
  })


  it('AccountUserInfo', async () => {
    const res = await rmqService.triggerRoute<AccountUserInfo.Request, AccountUserInfo.Response>(AccountUserInfo.topic, {
      id: userId,
    })

    expect(res.profile.displayName).toEqual(authRegister.displayName);
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    await app.close();
  });
});
