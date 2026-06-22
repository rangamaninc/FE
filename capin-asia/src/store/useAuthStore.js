import { create } from "zustand";
import { persist } from "zustand/middleware";

/** UI auth mirror — business auth remains in Redux during migration. */
export const useAuthStore = create(
  persist(
    (set) => ({
      userEmail: "",
      userRole: "",
      isAuthenticated: false,
      setSession: ({ userEmail, userRole, isAuthenticated = true }) =>
        set({ userEmail, userRole, isAuthenticated }),
      clearSession: () =>
        set({ userEmail: "", userRole: "", isAuthenticated: false }),
    }),
    { name: "capin-auth-ui" }
  )
);
