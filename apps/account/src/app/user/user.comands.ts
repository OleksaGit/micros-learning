import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountBuyCourse,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@micros-learning/contracts';
import { UserService } from './user.service';

@Controller()
export class UserCommands {
  constructor(
    private readonly userService: UserService,
  ) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeProfile(
    @Body() dto: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
      return await this.userService.changeProfile(dto.user, dto.id)
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(
    @Body() { userId, courseId }: AccountBuyCourse.Request
  ): Promise<AccountBuyCourse.Response> {
   return await this.userService.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ){
    return await this.userService.checkPayment(userId, courseId)
  }
}
