import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';

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
        try {
          const res = await authApi.getMeApi();
          const user = res.data;
          set({ user, isAuthenticated: true });
          return user;
        } catch {
          // Attempt silent refresh
          try {
            const refreshRes = await authApi.refreshApi();
            const token = refreshRes.data.accessToken;
            window.__ACCESS_TOKEN__ = token;
            const meRes = await authApi.getMeApi();
            set({ user: meRes.data, accessToken: token, isAuthenticated: true });
            return meRes.data;
          } catch {
            window.__ACCESS_TOKEN__ = null;
            set({ user: null, accessToken: null, isAuthenticated: false });
            return null;
          }
        }
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
