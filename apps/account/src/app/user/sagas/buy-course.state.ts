import { BuyCourseSaga } from './buy-course.saga';
import { UserEntity } from '../entities/user.entity';

export abstract class BuyCourseSagaState {
  saga: BuyCourseSaga

  setContext(saga: BuyCourseSaga) {
    this.saga = saga
  }

  abstract pay(): Promise<{paymentLink: string, user: UserEntity}>

  abstract checkPayment(): Promise<{user: UserEntity}>

  abstract cancel(): Promise<{user: UserEntity}>

}
