import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserId } from '../../guards/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('user')
export class UserController {

  @UseGuards(JwtGuard)
  @Post('info')
  async info(@UserId() userId: string) {}
}
