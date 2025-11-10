import type { LoggedInUserData } from '.';
import type { UserType } from './Users';

export interface AuthContextType {
  username: string;
  token: string;
  userType: UserType | undefined;
  isLoggedIn: boolean;
  handleLoggedInContext: (loggedInUserData: LoggedInUserData) => void;
  handleLoggedOutContext: () => void;
}