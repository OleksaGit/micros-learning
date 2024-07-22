export function userInterface(): string {
  return 'userInterface';
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
