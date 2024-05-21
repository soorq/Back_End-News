export interface IJwtPayload {
  sub: number;
  role: string;
  email: string;
}

export interface ITokens {
  __v_AC_T: string;
  __v_RT_T: string;
}

export interface IJwtPayloadRefresh extends IJwtPayload {
  refresh: string;
}
