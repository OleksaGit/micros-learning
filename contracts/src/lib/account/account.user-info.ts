import { IsString } from 'class-validator';
import { UserRole } from '@micros-learning/interfaces';

export namespace AccountUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
   profile: {
     email: string;
     role: UserRole;
     displayName: string;
   }
  }
}
