"use client";

import { CircleUser, CreditCard, EllipsisVertical, LogOut, MessageSquareDot } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn, getInitials } from "@/lib/utils";
import { clearAuthToken } from "@/features/auth/actions/auth-actions";
import { AuthProfile } from "@/features/auth/types";
import { NotificationType, User } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/shared/hooks/useNotifications";

export function NavUser({
  user,
}: {
  readonly user: User | null;
}) {
  const router = useRouter();
  const userName = user ? user.fullName : "Invitado";
  const { isMobile } = useSidebar();
  const { notifications } = useNotifications();

  const handleLogout = async () => {
    await clearAuthToken();
    router.push("/auth/login"); 
  };

  const NotificationsTypeLabels: Record<string, string> = {
    "NewTicket": "Nuevo Ticket",
    "NewChatMessage": "Nuevo Mensaje del chat"
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-muted-foreground text-xs">{userName}</span>
              </div>
              <Badge>
                {notifications.length}
              </Badge>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className={cn({"animate-pulse bg-primary text-white" : notifications.length})}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <MessageSquareDot />
                      <span>Notificaciones</span>
                      <Badge>
                        {notifications.length}
                      </Badge>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {notifications.map((notification, idx) => 
                      // notification.type === NotificationType.NEW_TICKET ?
                      <DropdownMenuGroup key={idx}>
                        <DropdownMenuItem  className="flex flex-col gap-2">
                          <Badge className="text-xs bg-primary text-white hover:text-white! items-start">{NotificationsTypeLabels[notification.type]}</Badge>
                          <span>{notification.message}</span>
                        </DropdownMenuItem>

                      </DropdownMenuGroup>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
