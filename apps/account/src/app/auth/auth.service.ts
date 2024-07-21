import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@micros-learning/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@micros-learning/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
  }

  async register({email, password, displayName}: AccountRegister.Request): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUser(email)
    if (oldUser) {
      throw new Error('This user is registered')
    }

    const newUserEntity = await new UserEntity({
      displayName,
      email,
      role: UserRole.student,
      passwordHash: '',
    }).setPassword(password)

    const newUser = await this.userRepository.createUser(newUserEntity)
    return { email: newUser.email};
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email)
    if (!user) {
      throw new Error('Wrong login or password');
    }
    const userEntity = new UserEntity(user)
    const isCorrectPassword = userEntity.validatePassword(password)
    if (!isCorrectPassword) {
      throw new Error('Wrong login or password');
    }
    return { id: user._id}
}

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({id})
    }
  }
}
