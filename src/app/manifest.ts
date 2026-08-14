import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tareas Carflash',
    short_name: 'Carflash',
    description: 'Tareas Carflash is a modern, open-source dashboard starter template built with Next.js 16, Tailwind CSS v4, and shadcn/ui.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'productivity'],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Ir al dashboard principal',
        url: '/dashboard/kanban',
        icons: [
          {
            src: '/icons/icon-192x192-maskable.png',
            sizes: '192x192',
          },
        ],
      },
      {
        name: 'Tickets',
        short_name: 'Tickets',
        description: 'Gestionar tickets',
        url: '/dashboard/kanban',
        icons: [
          {
            src: '/icons/icon-192x192-maskable.png',
            sizes: '192x192',
          },
        ],
      },
      {
        name: 'Usuarios',
        short_name: 'Usuarios',
        description: 'Gestionar usuarios',
        url: '/dashboard/users',
        icons: [
          {
            src: '/icons/icon-192x192-maskable.png',
            sizes: '192x192',
          },
        ],
      },
    ],
  }
}