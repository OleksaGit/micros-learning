import { BuyCourseSagaState } from './buy-course.state';
import { UserEntity } from '../entities/user.entity';
import { CourseGetCourse, PaymentCheck, PaymentGenerateLink } from '@micros-learning/contracts';
import { PurchaseState } from '@micros-learning/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId)
    return { user: this.saga.user }
  }

  checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Don\'t possible check payment if it not started')
  }

  async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, { id: this.saga.courseId });

    if (!course) {
      throw new Error('This course was not found')
    }

    if (course.price === 0) {
      this.saga.setState(PurchaseState.Purchased, course._id)
      return { paymentLink: null, user: this.saga.user}
    }

    const { paymentLink} = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    })
    this.saga.setState(PurchaseState.WaitingForPayment, course._id)
    return { paymentLink, user: this.saga.user }
  }
}

export class BuyCourseSagaStateWaitingForpayment extends BuyCourseSagaState {
  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Don\'t possible cancel payments, if payment processing')
  }

  async checkPayment(): Promise<{ user: UserEntity }> {
    const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    })

    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled, this.saga.courseId)
      return { user: this.saga.user }
    }
    if (status !== 'success') {
      return { user: this.saga.user }
    } else {
      this.saga.setState(PurchaseState.Purchased, this.saga.courseId)
    }
  }

  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
   throw new Error('Don\'t possible create payment link, if payment processing')
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Don\'t possible canceled bought course')
  }

  async checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Don\'t possible check paid, if course paid')
  }

  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Don\'t possible paying, if course paid')
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Don\'t possible canceled bought course')
  }

  async checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Don\'t possible check payment, if course canceled')
  }

  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId)
    return this.saga.getState().pay();
  }
}
