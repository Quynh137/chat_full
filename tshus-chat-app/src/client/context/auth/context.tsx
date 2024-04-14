import { createContext, Dispatch, useEffect, useReducer } from 'react';
import { getCookie } from '@/common/utils/cookie';
import { AuthState } from '@/common/types/auth/types';
import { initialize, reducer } from './reducers';

export enum AuthActionType {
  INITIALZE = 'INITIALIZE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface PayloadAction<T> {
  type: AuthActionType;
  payload: T;
}

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<PayloadAction<AuthState>>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  dispatch: () => {},
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }: Props) => {
  // State
  const [state, dispatch] = useReducer(reducer, initialState);

  // Use Effect
  useEffect(() => {
    (async () => {
      // Get access token from cookie
      const accessToken = getCookie('token');

      // Check access oken
      if (!accessToken) {
        return dispatch(initialize({ isAuthenticated: false }));
      }

      // User
      try {
        const user = getCookie('user');
        dispatch(initialize({ isAuthenticated: true, ...user })); 
      } catch (error) {
        dispatch(initialize({ isAuthenticated: false }));
      }
    })();
  }, []);

  // Shared
  const shared: any = {
    user: {
      get: state,
      set: dispatch,
    },
  };

  // Return
  return <AuthContext.Provider value={shared}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
