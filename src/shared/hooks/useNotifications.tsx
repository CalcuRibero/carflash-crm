'use client'

import { fetchUnread } from "@/lib/api/notifications";
import { Notification } from "@/lib/api/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


type NotificationContextValues = {
  notifications: Notification[],
}

const NotificationsContext = createContext<NotificationContextValues | null >(null)

export function NotificationsProvider ({children}: {children: ReactNode}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const getNotifications = async() => {
    const unreads = await fetchUnread()
    setNotifications(unreads)
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
    <NotificationsContext.Provider value={{notifications}}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}