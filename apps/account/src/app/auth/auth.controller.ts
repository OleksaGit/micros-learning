import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@micros-learning/contracts';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('register')
  async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return await this.authService.register(dto)
  }

  @Post('login')
  async login(@Body() dto: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(dto.email, dto.password)
    return await this.authService.login(id)
  }
}

