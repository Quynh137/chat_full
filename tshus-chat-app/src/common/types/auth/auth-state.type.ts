export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  username?: string;
  password?: string;
  roles?: string[];
  firstname?: string;
  lastname?: string;
  phone?: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
