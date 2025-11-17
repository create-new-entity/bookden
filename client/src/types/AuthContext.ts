import type { LoggedInUserData } from '.';
import type { UserType } from './Users';

export interface AuthContextType {
  username: string;
  token: string;
  email: string;
  userType: UserType | undefined;
  isLoggedIn: boolean;
  saveToken: (token: string) => void;
  clearAuthentication: () => void;
  hasExistingLoggedInUser: () => {
    isUserLoggedIn: boolean;
    existingLoggedInData: LoggedInUserData | null;
  }
}