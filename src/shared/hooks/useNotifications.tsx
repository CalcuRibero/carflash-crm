// hooks/useNotifications.ts
'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuthContext';
import { getApiToken } from '../utils/apiClient';

export function useNotifications() {
  const token = getApiToken();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    const socket: Socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`, {
      auth: { token: token },
    });

    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
      // opcional: mostrar un toast
    });

    socket.on('connect_error', (err) => {
      console.error('WS auth error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return notifications;
}