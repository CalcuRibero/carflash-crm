'use client'

import { fetchUnread } from "@/lib/api/notifications";
import { Notification } from "@/lib/api/types";
import { isTicketAvailableService } from "@/features/tickets/services/ticketsService";
import { markNotificationAsRead } from "@/lib/api/notifications";
import { filterNotificationsByExistingTickets } from "@/shared/utils/filterNotifications";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


type NotificationContextValues = {
  notifications: Notification[],
  removeNotification: (id: string) => void,
}

const NotificationsContext = createContext<NotificationContextValues | null >(null)

export function NotificationsProvider ({children}: {children: ReactNode}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const getNotifications = async() => {
    const unreads = await fetchUnread()
    const { existing, missing } = await filterNotificationsByExistingTickets(
      unreads,
      (ticketId) => isTicketAvailableService(ticketId),
    );
    setNotifications(existing)

    await Promise.allSettled(missing.map((notification) => markNotificationAsRead(notification.id)));
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  useEffect(() =>
    {
      getNotifications()
     
      const intervalId = setInterval(async () => {
        if (document.visibilityState === 'visible') {
          getNotifications()
        }
      }, 60000)

      return () => clearInterval(intervalId)
    }  
    , []
  )

  return (
    <NotificationsContext.Provider value={{notifications, removeNotification}}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}