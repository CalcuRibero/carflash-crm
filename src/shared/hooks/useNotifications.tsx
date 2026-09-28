"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { fetchUnread } from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/types";

type NotificationContextValues = {
  notifications: Notification[];
  removeNotification: (id: string) => void;
};

const NotificationsContext = createContext<NotificationContextValues | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getNotifications = async () => {
    const unreads = await fetchUnread();
    setNotifications(unreads);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  useEffect(() => {
    getNotifications();

    const intervalId = setInterval(async () => {
      if (document.visibilityState === "visible") {
        getNotifications();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, removeNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
