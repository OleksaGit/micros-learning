import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from '@micros-learning/interfaces';
import { compare, genSalt, hash } from 'bcrypt';
import { AccountChangedCourse } from '@micros-learning/contracts';

export class UserEntity implements IUser{
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id?.toString();
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.passwordHash = user.passwordHash;
    this.courses = user.courses;
  }

  setCourseStatus(courseId: string, state: PurchaseState) {
    const exist = this.courses.find((c) => c.courseId === courseId)
    if (exist) {
      this.courses.push({
        courseId,
        purchaseState: state,
      })
      return this
    }

    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter((c) => c.courseId !== courseId)
    }

    this.courses = this.courses.map((c) => {
      if (c.courseId === courseId) {
        c.purchaseState = state
        return c;
      }

      return c;
    })
    this.events.push( { topic: AccountChangedCourse.topic, data: {courseId, userId: this._id, state}})
    return this
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
