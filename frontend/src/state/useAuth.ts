import create from 'zustand';
import { signup as apiSignup, login as apiLogin, AuthResponse, refresh as apiRefresh } from '../api/auth';
import { api } from '../api/client';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type AuthStore = {
  status: AuthStatus;
  user?: AuthResponse['user'];
  accessToken?: string;
  refreshToken?: string;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  refresh: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set, get) => ({
  status: 'unauthenticated',
  setAuth: (auth) => {
    api.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`;
    set({
      status: 'authenticated',
      user: auth.user,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    });
  },
  logout: () => {
    delete api.defaults.headers.common.Authorization;
    set({ status: 'unauthenticated', user: undefined, accessToken: undefined, refreshToken: undefined });
  },
  login: async (payload) => {
    const auth = await apiLogin(payload);
    get().setAuth(auth);
  },
  signup: async (payload) => {
    const auth = await apiSignup(payload);
    get().setAuth(auth);
  },
  refresh: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) return;
    const auth = await apiRefresh(refreshToken);
    get().setAuth(auth);
  },
}));
