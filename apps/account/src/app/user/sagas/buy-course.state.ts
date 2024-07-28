import { BuyCourseSaga } from './buy-course.saga';
import { UserEntity } from '../entities/user.entity';
import { PaymentStatus } from '@micros-learning/contracts';

export abstract class BuyCourseSagaState {
  saga: BuyCourseSaga

  setContext(saga: BuyCourseSaga) {
    this.saga = saga
  }

  abstract pay(): Promise<{paymentLink: string, user: UserEntity}>

  abstract checkPayment(): Promise<{user: UserEntity, status: PaymentStatus}>

  abstract cancel(): Promise<{user: UserEntity}>

}
