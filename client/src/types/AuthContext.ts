import type { LoggedInUserData } from '.';
import type { UserType } from './Users';

export interface AuthContextType {
  token: string | null;
  userType: UserType | undefined;
  isLoggedIn: boolean;
  handleLoggedInContext: (loggedInUserData: LoggedInUserData) => void;
  handleLoggedOutContext: () => void;
}