// import type { UserTypes } from "./Users";


export interface AuthContextType {
  token: string | null;
//   userType: UserTypes | null;
  isLoggedIn: boolean;
  handleLoggedInContext: (token: string) => void;
  handleLoggedOutContext: () => void;
}