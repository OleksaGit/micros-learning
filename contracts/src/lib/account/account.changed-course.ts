import { IsString } from 'class-validator';
import { PurchaseState } from '@micros-learning/interfaces';

export namespace AccountChangedCourse {
  export const topic = 'account.changed-course.event';

  export class Request {
    @IsString()
    courseId: string;

    @IsString()
    userId: string;

    @IsString()
    state: PurchaseState;
  }
}
