export function userInterface(): string {
  return 'userInterface';
}
export enum UserRole {
  Teacher = 'teacher',
  student= 'student',
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
}


export interface IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
}

export interface IUserCourses {
  courseId: string;
  purchaseState: PurchaseState;
}
