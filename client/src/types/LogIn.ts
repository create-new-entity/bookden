import type { UserTypes } from "./Users";


export type LoginFormInputs = {
  username: string;
  password: string;
}

interface SignUp {
  username: string;
  email: string;
  password: string;
}

export interface SignUpFormInputs extends SignUp {
  confirmPassword: string;
}
export interface SignUpPayload extends SignUp {
  userType: UserTypes;
  isActive: boolean;
}
