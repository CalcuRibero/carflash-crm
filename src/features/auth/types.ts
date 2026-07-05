export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type AuthProfile = {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
};
