import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '@micros-learning/interfaces';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity): Promise<User> {
    const newUser = new this.userModel(user)
    return newUser.save()
  }

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec()
  }

  async findUserById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec()
  }

  async deleteUser(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }

  async updateUser({ _id, ...rest}: IUser) {
    return this.userModel.updateOne({ _id }, { $set: { rest }}).exec()
  }

}
