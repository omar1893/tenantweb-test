export type DecodedToken = {
  iss: string;
  iat: number;
  exp: number;
  sub: string;
  typ: string;
  em: string;
  roles: string[];
}

export type TokenPair = {
  access_token: string;
  refresh_token: string;
}

export type AuthType = 'password-less' | 'provider';

export type AuthState = {
  isAuthenticated: boolean;
  user: {
    email: string;
    roles: string[];
  } | null;
  accessToken: string | null;
  authType: AuthType | null;
}

export type LoginResponse = {
  tokens: TokenPair;
  user: {
    email: string;
    roles: string[];
  };
}

export type RefreshTokenResponse = {
  tokens: TokenPair;
}

export type AuthError = {
  message: string;
  code: string;
}
