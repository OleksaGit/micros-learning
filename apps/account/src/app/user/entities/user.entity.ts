import { IUser, IUserCourses, UserRole } from '@micros-learning/interfaces';
import { compare, genSalt, hash } from 'bcrypt';

export class UserEntity implements IUser{
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];

  constructor(user: IUser) {
    this._id = user._id.toString();
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.passwordHash = user.passwordHash;
    this.courses = user.courses;
  }

  getPublicProfile() {
      return {
        profile: {
          email: this.email,
          role: this.role,
          displayName: this.displayName,
        }
      }
  }

  async setPassword(password: string) {
    const salt = await genSalt(10)
    this.passwordHash = await hash(password, salt);
    return this;
  }

  validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  updateProfile(displayName: string) {
    this.displayName = displayName;
    return this
  }
}
