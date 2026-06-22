import { create } from "zustand";

let notificationId = 0;

export const useNotificationStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  addNotification: (notification) => {
    const id = ++notificationId;
    const item = {
      id,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    set({
      items: [item, ...get().items].slice(0, 50),
      unreadCount: get().unreadCount + 1,
    });
    return id;
  },
  markAsRead: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, read: true })),
      unreadCount: 0,
    })),
  clearNotifications: () => set({ items: [], unreadCount: 0 }),
}));
