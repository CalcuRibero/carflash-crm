export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type AuthProfile = {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
};
