import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SanitizedUser } from '@/common/types/user.type';

interface AuthState {
  user: SanitizedUser | null;
  isHydrated: boolean;
  login: (user: SanitizedUser) => void;
  logout: () => void;
  setUser: (user: SanitizedUser) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      setUser: (user) => set({ user }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
