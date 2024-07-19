export function interfaces(): string {
  return 'interfaces';
}
export enum UserRole {
  Teacher = 'teacher',
  student= 'Student',
}

export interface IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
