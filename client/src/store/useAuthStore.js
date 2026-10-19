import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';

// Share the startup request when React Strict Mode invokes the effect twice.
let authCheckPromise = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        window.__ACCESS_TOKEN__ = token;
        set({ user, accessToken: token, isAuthenticated: !!user });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await authApi.loginApi(credentials);
          const { user, accessToken } = res.data;
          window.__ACCESS_TOKEN__ = accessToken;
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authApi.logoutApi();
        } catch {
          // ignore error on logout
        } finally {
          window.__ACCESS_TOKEN__ = null;
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        if (authCheckPromise) return authCheckPromise;

        authCheckPromise = (async () => {
          try {
            // The Axios interceptor performs one refresh for a 401. Avoid a
            // second refresh for 429s or any other failed request.
            const res = await authApi.getMeApi();
            const user = res.data;
            set({ user, isAuthenticated: true });
            return user;
          } catch {
            window.__ACCESS_TOKEN__ = null;
            set({ user: null, accessToken: null, isAuthenticated: false });
            return null;
          }
        })().finally(() => {
          authCheckPromise = null;
        });

        return authCheckPromise;
      },

      updateUser: (updatedUser) => {
        set({ user: updatedUser });
      },
    }),
    {
      name: 'icosst-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
