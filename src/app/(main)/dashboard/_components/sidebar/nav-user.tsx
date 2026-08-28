"use client";

import { ChevronRight, CircleUser, CreditCard, DoorOpen, EllipsisVertical, LogOut, MessageSquareDot } from "lucide-react";
import { useRouter } from "next/navigation";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn, getInitials } from "@/lib/utils";
import { clearAuthToken } from "@/features/auth/actions/auth-actions";
import { AuthProfile } from "@/features/auth/types";
import { Notification, NotificationType, User } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { markNotificationAsRead } from "@/lib/api/notifications";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";

function getNotificationTitle(notification: string) {
  const title = notification.split(":")[1]
  return title
}

export function NavUser({
  user,
}: {
  readonly user: User | null;
}) {
  const router = useRouter();
  const userName = user ? user.fullName : "Invitado";
  const { isMobile } = useSidebar();
  const { notifications, removeNotification } = useNotifications();
  const [isOpenSettings, setIsOpenSettings] = useState(true)

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    removeNotification(notification.id)
    if (!notification.meta?.ticketId) {
      router.replace('/dashboard/kanban')
      return
    }
    router.replace(`/dashboard/kanban/${notification.meta?.ticketId}`)
  }

  const handleLogout = async () => {
    await clearAuthToken();
    router.push("/auth/login");
  };


  const handleProfile = () => {
    if (!user) return
    router.push(`/dashboard/user-metrics/${user.id}`)
  }


  const NotificationsTypeLabels: Record<string, string> = {
    "NewTicket": "Nuevo Ticket",
    "NewChatMessage": "Nuevo Mensaje del chat"
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="max-w-lg"
    >
      <AccordionItem value="notification">
        <AccordionContent className="flex flex-col bg-background text-foreground rounded-md">
          {notifications.map((notification, idx) =>
            // notification.type === NotificationType.NEW_TICKET ?
            <Button variant={'ghost'} onClick={() => { handleNotificationClick(notification) }} className="flex justify-between hover:bg-primary hover:text-background">
              <span key={idx} >{getNotificationTitle(notification.message)}</span>
              <span>
                <ChevronRight/>
              </span>
            </Button>
          )}
        </AccordionContent>
        <AccordionTrigger disabled={!notifications.length} className="flex gap-2">
          <span className="flex gap-2">
            <MessageSquareDot />
            <span>Notificaciones</span>
          </span>
          <Badge>
            {notifications.length}
          </Badge>
        </AccordionTrigger>
      </AccordionItem>
      <AccordionItem value="user-settings">
        <AccordionContent>
          <Button variant="ghost" className="flex justify-start w-full" onClick={handleProfile}>
            <CircleUser />
            <span>Perfil</span>
          </Button>
          <Button variant="ghost" className="flex justify-start w-full" onClick={handleLogout}>
            <DoorOpen />
            <span>Salir</span>
          </Button>
        </AccordionContent>

        <AccordionTrigger>{userName}</AccordionTrigger>
      </AccordionItem>

    </Accordion>
  )

  // return (
  //   <SidebarMenu>
  //     <SidebarMenuItem>
  //         {
  //           isOpenSettings && 
  //             (
  //               <>
  //                 <SidebarMenuButton disabled={!notifications.length}>
  //                     <MessageSquareDot />
  //                     <span>Notificaciones</span>
  //                     <Badge>
  //                       {notifications.length}
  //                     </Badge>
  //                   </SidebarMenuButton>
  //                 <SidebarMenuButton>
  //                     <CircleUser/>
  //                     <span>Perfil</span>
  //                   </SidebarMenuButton>
  //               </>
  //             )  
  //         }
  //         <SidebarMenuButton
  //           size="lg"
  //           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
  //           onClick={() => {setIsOpenSettings(!isOpenSettings)}}
  //         >
  //           <div className="grid flex-1 text-left text-sm leading-tight">
  //             <span className="truncate text-muted-foreground text-xs">{userName}</span>
  //           </div>
  //           <Badge>
  //             {notifications.length}
  //           </Badge>
  //           <EllipsisVertical className="ml-auto size-4" />
  //         </SidebarMenuButton>
  //     </SidebarMenuItem>
  //   </SidebarMenu>
  // );
}
