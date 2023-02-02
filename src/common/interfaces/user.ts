import { User } from '../entities/user.entity';

export enum UserStatus {
  guest = 'guest',
  loggedIn = 'logged in',
  profileSet = 'logged in profile set',
}

export interface UserInfo {
  status: UserStatus;
  information?: User;
}

export interface TokenInfo {
  uid: string;
  email: string;
}
