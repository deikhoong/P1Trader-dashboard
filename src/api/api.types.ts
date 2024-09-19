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
  data:{
    user: User,
    access_token: string,
    refresh_token: string,
  }
}
