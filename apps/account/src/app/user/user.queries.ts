import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountUserCourses,
  AccountUserInfo,
} from '@micros-learning/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserCourses } from './models/user.model';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {
  }

  @RMQValidate()
  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo(
    @Body() dto: AccountUserInfo.Request
  ): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(dto.id)
    const userEntity = new UserEntity(user)
    return userEntity.getPublicProfile()
  }

  @RMQValidate()
  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses(
    @Body() dto: AccountUserCourses.Request
  ): Promise<AccountUserCourses.Response> {
    const user = await this.userRepository.findUserById(dto.id)
    return { courses: user.courses as UserCourses[]} };
}
