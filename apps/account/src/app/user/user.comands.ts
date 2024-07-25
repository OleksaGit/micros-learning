import { Body, Controller } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@micros-learning/contracts';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {
  }

  @RMQValidate()
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

}
