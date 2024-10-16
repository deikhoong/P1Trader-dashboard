export interface LoginForm {
  email: string;
  password: string;
}

export type User = {
  id?: string,
  username?: string,
  role?: string,
  nickname?: string,
}

export type LoginResp = {
  data: {
    user: User,
    access_token: string,
    refresh_token: string,
  }
}

export type Pagination = {
  page: number;
  take: number;
};

export type CreateUserReq = {
  email: string;
  password: string;
  nickname: string;
  role: UserRole
}

export enum UserRole {
  Admin = 'Admin',
  Member = 'Member',
}
