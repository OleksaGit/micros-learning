import { Body, Controller } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@micros-learning/contracts';
import { UserEntity } from './entities/user.entity';
import { PurchaseState } from '@micros-learning/interfaces';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {
  }

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async userInfo(
    @Body() dto: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
    const existedUser = await this.userRepository.findUserById(dto.id)

    if (!existedUser) {
      throw new Error('User not found')
    }
    const userEntity = new UserEntity(existedUser).updateProfile(dto.user.displayName)
    await this.userRepository.updateUser(userEntity)
    return  {}
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(
    @Body() { userId, courseId }: AccountBuyCourse.Request
  ): Promise<AccountBuyCourse.Response> {
    return  Promise.resolve({ paymentUrl: ''})
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    return  Promise.resolve({ status: PurchaseState.Started})
  }

}
