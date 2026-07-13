// hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UseNotificationsProps = {
    assignedTo: string,
    title: string,
    type: 'ticket' | 'recurrentTicket'
}

export function useNotificationsTickets(
    {
        assignedTo,
        title,
        type
    }: UseNotificationsProps) {

    const server = process.env.NEXT_PUBLIC_API_BASE_PATH || "";
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const socket: Socket = io(server, {
            query: { assignedTo, title },
        });

        socket.on(type, (data) => {
            setNotifications((prev) => [data, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, [type]);

    return notifications;
}