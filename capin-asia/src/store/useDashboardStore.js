import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  stats: [],
  recentTransactions: [],
  tasks: [],
  isLoading: false,
  error: null,
  setStats: (stats) => set({ stats }),
  setRecentTransactions: (recentTransactions) => set({ recentTransactions }),
  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
