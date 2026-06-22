import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      compactMode: false,
      globalSearchQuery: "",
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCompactMode: (compactMode) => set({ compactMode }),
      setGlobalSearchQuery: (globalSearchQuery) => set({ globalSearchQuery }),
    }),
    { name: "capin-settings" }
  )
);
