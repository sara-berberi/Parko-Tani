import create, { GetState, SetState, StateCreator } from "zustand";
import {
  signup as apiSignup,
  login as apiLogin,
  AuthResponse,
  refresh as apiRefresh,
} from "../api/auth";
import { api } from "../api/client";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AuthStore = {
  status: AuthStatus;
  user?: AuthResponse["user"];
  accessToken?: string;
  refreshToken?: string;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  refresh: () => Promise<void>;
};

const createAuthStore: StateCreator<AuthStore> = (
  set: SetState<AuthStore>,
  get: GetState<AuthStore>,
) => ({
  status: "checking",
  setAuth: (auth: AuthResponse) => {
    api.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`;
    set({
      status: "authenticated",
      user: auth.user,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    });
  },
  logout: () => {
    delete api.defaults.headers.common.Authorization;
    set({
      status: "unauthenticated",
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
    });
  },
  login: async (payload: { email: string; password: string }) => {
    const auth = await apiLogin(payload);
    get().setAuth(auth);
  },
  signup: async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    const auth = await apiSignup(payload);
    get().setAuth(auth);
  },
  refresh: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) {
      set({ status: "unauthenticated" });
      return;
    }
    try {
      const auth = await apiRefresh(refreshToken);
      get().setAuth(auth);
    } catch (error) {
      set({ status: "unauthenticated" });
      throw error;
    }
  },
});

export const useAuth = create<AuthStore>(createAuthStore);
