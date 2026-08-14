# Manifiesto Funcional - CarFlash CRM

## 1. Descripción General

**CarFlash CRM** es un sistema de gestión de relaciones con clientes (CRM) especializado para el negocio automotriz. La aplicación permite la administración eficiente de usuarios, tickets de soporte, tareas recurrentes y métricas de rendimiento, proporcionando herramientas visuales interactivas como tableros Kanban y dashboards analíticos.

**Versión**: 2.2.0  
**Framework**: Next.js 16 con TypeScript  
**Interfaz**: Shadcn UI + Tailwind CSS v4

---

## 2. Arquitectura Técnica

### 2.1 Stack Tecnológico
- **Frontend**: Next.js 16 (App Router), React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: Shadcn UI, Radix UI
- **Gestión de Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **Tablas**: TanStack Table
- **Drag & Drop**: @dnd-kit
- **Gráficos**: Recharts
- **Comunicación**: Socket.io-client, Axios
- **Herramientas**: Biome (linting/formatting), Husky

### 2.2 Arquitectura de Archivos
El proyecto sigue una arquitectura de **colocalación**, donde cada feature contiene sus propios componentes, páginas, hooks y lógica:

```
src/
├── app/                 # Rutas de Next.js
├── features/            # Módulos de funcionalidad
│   ├── auth/           # Autenticación
│   ├── tickets/        # Gestión de tickets
│   ├── recurrent-tickets/ # Tickets recurrentes
│   ├── users/          # Gestión de usuarios
│   ├── users-metrics/  # Métricas de usuarios
│   ├── kanban/         # Tablero Kanban
│   └── chat/           # Sistema de chat
├── components/         # Componentes UI compartidos
├── lib/               # Utilidades y configuración
├── stores/            # Estado global
└── hooks/             # Hooks personalizados
```

---

## 3. Módulos Funcionales

### 3.1 Autenticación

**Descripción**: Sistema de autenticación seguro para el acceso a la aplicación.

**Funcionalidades**:
- Login con email y contraseña
- Gestión de tokens de acceso JWT
- Perfil de usuario autenticado
- Protección de rutas

**Tipos**:
```typescript
- LoginRequest: { email, password }
- LoginResponse: { access_token }
- AuthProfile: { sub, email, iat, exp }
```

**Componentes**:
- Formulario de login
- Servicios de autenticación
- Hooks de autenticación

---

### 3.2 Gestión de Usuarios

**Descripción**: Administración completa de los miembros de la organización con roles específicos.

**Roles Disponibles**:
- **SuperAdmin**: Acceso total al sistema
- **AdministrationAccountant**: Administración y contabilidad
- **ComercialCordinator**: Coordinación comercial
- **CarExpert**: Perito de automóviles
- **Gestor**: Gestión general
- **CarSeller**: Vendedor de autos
- **Marketing**: Marketing

**Funcionalidades**:
- Crear nuevos usuarios
- Editar usuarios existentes
- Listado de usuarios con tabla interactiva
- Filtrado por rol
- Búsqueda de usuarios
- Paginación
- Exportación de datos

**Campos de Usuario**:
```typescript
{
  id: number
  username: string
  email: string
  role: UserRole
  fullName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

**Componentes**:
- `UsersTable`: Tabla con TanStack Table
- `CreateUsersModal`: Modal de creación
- `EditUserModal`: Modal de edición
- `users-columns`: Definición de columnas

---

### 3.3 Sistema de Tickets

**Descripción**: Gestión de tickets de soporte y tareas con seguimiento completo.

**Estados de Ticket**:
- **open**: Abierto
- **in_progress**: En progreso
- **resolved**: Resuelto
- **closed**: Cerrado

**Prioridades**:
- **low**: Baja
- **medium**: Media
- **high**: Alta
- **critical**: Crítica

**Categorías**:
- **bug**: Errores
- **feature**: Funcionalidades
- **support**: Soporte
- **incident**: Incidentes

**Funcionalidades**:
- Crear tickets
- Editar tickets existentes
- Asignar tickets a usuarios
- Establecer fechas de vencimiento
- Seguimiento de progreso
- Filtrado y búsqueda

**Campos de Ticket**:
```typescript
{
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category?: TicketCategory
  createdBy?: User
  assignedTo?: User | null
  createdAt?: string
  updatedAt?: string
  dueDate?: string | null
  resolvedAt?: string | null
  progress?: number
  insights?: TicketInsight[]
  owner?: TicketOwnerProfile
}
```

**Componentes**:
- `TicketsModal`: Modal de creación/edición
- Formulario con validación Zod
- Selectores de estado, prioridad, categoría
- Selector de asignación a usuarios

---

### 3.4 Tickets Recurrentes

**Descripción**: Sistema de tickets que se generan automáticamente en intervalos regulares.

**Intervalos de Recurrencia**:
- **DAILY**: Diario
- **WEEKLY**: Semanal
- **MONTHLY**: Mensual
- **YEARLY**: Anual

**Categorías Específicas**:
- SuperAdmin
- AdministrationAccountancy
- ComercialCordination
- CarExpert (Perito)
- Gestor
- CarSelling (Vendedor de Autos)
- Marketing

**Funcionalidades**:
- Crear tickets recurrentes
- Editar configuración de recurrencia
- Eliminar tickets recurrentes
- Tabla con información de recurrencia
- Visualización de próxima ejecución
- Control de fecha de primera ejecución

**Campos de Ticket Recurrente**:
```typescript
{
  id: string
  title: string
  description: string
  status?: TicketStatus
  priority?: TicketPriority
  category?: TicketCategory
  assignedTo?: string | null
  dueDate: Date
  interval: RecurrenceInterval
  first_run_at: Date
}
```

**Componentes**:
- `RecurrentTicketsTable`: Tabla especializada
- `CreateRecurrentTicketModal`: Modal de creación
- `UpdateRecurrentTicketModal`: Modal de edición
- `InfoCards`: Tarjetas informativas
- `SearchBar`: Barra de búsqueda

---

### 3.5 Tablero Kanban

**Descripción**: Interfaz visual de tipo tablero para gestión de tareas con drag & drop.

**Columnas del Tablero**:
- **open**: Tareas abiertas
- **in_progress**: Tareas en progreso
- **resolved**: Tareas resueltas
- **closed**: Tareas cerradas

**Funcionalidades**:
- Drag & drop de tareas entre columnas
- Reordenamiento de tareas dentro de columnas
- Reordenamiento de columnas
- Creación de nuevas tareas
- Edición de tareas existentes
- Vista responsive (desktop y móvil)
- Sincronización con estado del servidor

**Características Técnicas**:
- Implementación con @dnd-kit
- Soporte para touch y mouse
- Atajos de teclado
- Drag overlay para mejor UX
- Detección de colisiones con closestCorners

**Componentes**:
- `Kanban`: Componente principal
- `KanbanColumn`: Columna individual
- `TaskCard`: Tarjeta de tarea
- `MobileKanbanColumn`: Versión móvil
- `SortableTaskCard`: Versión ordenable

---

### 3.6 Métricas de Usuarios

**Descripción**: Sistema de análisis y visualización del rendimiento de usuarios por tickets.

**Funcionalidades**:
- Tarjetas de métricas (KPIs)
- Gráficos de distribución de estados
- Tabla detallada de tickets por usuario
- Filtros por usuario
- Visualización de carga de trabajo

**Métricas Visualizadas**:
- Total de tickets
- Tickets por estado (abierto, resuelto, en progreso, cerrado)
- Distribución por categoría
- Tendencias de resolución

**Componentes**:
- `MetricsComponent`: Componente principal
- `MetricsCards`: Tarjetas de KPIs
- `MetricsChart`: Gráficos con Recharts
- `MetricsTable`: Tabla detallada
- `MetricsHeader`: Encabezado con filtros

**Configuración de Gráficos**:
```typescript
{
  abierto: { label: "Abierto", color: "var(--chart-1)" }
  resuelto: { label: "Resuelto", color: "var(--chart-2)" }
  en_progreso: { label: "En Progreso", color: "var(--chart-3)" }
  cerrado: { label: "Cerrado", color: "var(--chart-4)" }
}
```

---

### 3.7 Sistema de Chat

**Descripción**: Sistema de mensajería en tiempo real para comunicación interna.

**Funcionalidades**:
- Lista de conversaciones
- Chat en tiempo real
- Perfiles de usuarios
- Historial de mensajes
- Notificaciones de nuevos mensajes

**Componentes**:
- `Chat`: Componente principal
- `ChatSidebar`: Barra lateral de conversaciones
- `ChatThread`: Hilo de conversación
- `ChatConversationList`: Lista de conversaciones
- `ChatHeader`: Encabezado de chat
- `ChatProfileDetails`: Detalles de perfil

---

### 3.8 Dashboards

**Descripción**: Múltiples vistas de dashboard para diferentes necesidades del negocio.

**Dashboards Disponibles**:
- **Default**: Dashboard principal
- **CRM**: Vista de gestión de relaciones
- **Finance**: Dashboard financiero
- **Analytics**: Análisis y métricas
- **Productivity**: Productividad del equipo
- **E-commerce**: Dashboard de comercio electrónico
- **Kanban**: Tablero de tareas
- **Mail**: Vista de correos
- **Chat**: Vista de chat
- **Users**: Gestión de usuarios
- **User Metrics**: Métricas por usuario
- **Roles**: Gestión de roles
- **Recurrent Tickets**: Tickets recurrentes

**Características Comunes**:
- Layout responsive
- Sidebar colapsable
- Tema personalizable (claro/oscuro)
- Presets de colores (Tangerine, Neo Brutalism, Soft Pop)
- Navegación intuitiva

---

## 4. Sistema de Notificaciones

**Descripción**: Sistema de notificaciones para alertas y comunicaciones.

**Tipos de Notificación**:
- **NEW_TICKET**: Nuevo ticket creado
- **NEW_CHAT_MESSAGE**: Nuevo mensaje en chat

**Estructura de Notificación**:
```typescript
{
  id: string
  userId: string
  type: NotificationType
  message: string
  meta: NotificationMeta | null
  read: boolean
  createdAt: string
}
```

**Metadatos**:
- ticketId: ID del ticket relacionado
- url: URL para navegación

---

## 5. Gestión de Estado

**Stores Zustand**:
- Estado global de autenticación
- Estado de tickets
- Estado de usuarios
- Estado de notificaciones

---

## 6. API y Backend

**Comunicación**:
- Cliente Axios configurado
- Proxy para desarrollo
- Tipos TypeScript para requests/responses
- Manejo de errores centralizado

**Endpoints Principales**:
- Autenticación (login, perfil)
- CRUD de usuarios
- CRUD de tickets
- CRUD de tickets recurrentes
- Métricas y estadísticas
- Chat en tiempo real (WebSocket)

---

## 7. UI/UX

**Características de Diseño**:
- Diseño moderno y minimalista
- Responsive (mobile-first)
- Modo claro/oscuro
- Temas personalizables
- Animaciones suaves
- Accesibilidad (WCAG)
- Iconos Lucide React
- Componentes Shadcn UI

**Componentes UI Compartidos**:
- Modal
- Button
- Input
- Select
- Table
- Card
- Badge
- Tabs
- Dialog
- Dropdown Menu
- Y más...

---

## 8. Flujos de Trabajo Principales

### 8.1 Flujo de Gestión de Tickets
1. Usuario crea ticket desde modal
2. Asigna categoría, prioridad y usuario
3. Ticket aparece en tablero Kanban
4. Usuario arrastra ticket entre columnas
5. Sistema actualiza estado automáticamente
6. Ticket se marca como resuelto/cerrado

### 8.2 Flujo de Tickets Recurrentes
1. Administrador configura ticket recurrente
2. Define intervalo (diario, semanal, etc.)
3. Establece fecha de primera ejecución
4. Sistema genera tickets automáticamente
5. Usuarios asignados reciben notificaciones

### 8.3 Flujo de Onboarding de Usuarios
1. Administrador crea nuevo usuario
2. Asigna rol específico
3. Usuario recibe credenciales
4. Usuario inicia sesión
5. Sistema muestra dashboard según rol

---

## 9. Seguridad

**Implementaciones**:
- Autenticación JWT
- Protección de rutas
- Validación de formularios con Zod
- Sanitización de inputs
- Manejo seguro de tokens
- RBAC (Role-Based Access Control) planeado

---

## 10. Internacionalización

**Idioma de la Interfaz**: Español

**Elementos Localizados**:
- Labels de categorías de tickets
- Labels de roles de usuarios
- Estados de tickets
- Prioridades
- Intervalos de recurrencia
- Mensajes de error y éxito

---

## 11. Desarrollo y Despliegue

**Scripts Disponibles**:
```bash
npm run dev          # Servidor de desarrollo (puerto 3001)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con Biome
npm run format       # Formateo con Biome
npm run check        # Verificación completa
npm run check:fix    # Verificación y autocorrección
```

**Herramientas de Calidad**:
- Biome para linting y formateo
- Husky para git hooks
- Lint-staged para pre-commit
- TypeScript para type safety

---

## 12. Roadmap y Mejoras Futuras

**Planeado**:
- Multi-tenant support
- Calendar page
- Invoice page
- RBAC completo
- Sistema de permisos granular
- Exportación avanzada
- Integración con calendarios externos
- Móvil nativo

---

## 13. Requisitos del Sistema

**Requisitos de Desarrollo**:
- Node.js (versión compatible)
- npm o yarn
- Navegador moderno

**Requisitos de Producción**:
- Servidor Next.js
- Base de datos (configurable)
- Servidor WebSocket para chat
- Servidor de archivos para adjuntos

---

## 14. Soporte y Mantenimiento

**Documentación**:
- README.md con instrucciones de instalación
- Frontend rules.md con guías de desarrollo
- Contributing.md con guía de contribuciones

**Licencia**: Ver archivo LICENSE

---

## 15. Funcionalidad PWA (Progressive Web App)

**Descripción**: La aplicación cuenta con soporte PWA para permitir instalación en dispositivos móviles y escritorio, funcionando offline con caché básico.

**Archivos de Configuración PWA**:

### 15.1 Manifest Web App
**Ubicación**: `src/app/manifest.ts`

**Implementación**: Siguiendo la documentación oficial de Next.js, el manifest se genera dinámicamente mediante un archivo TypeScript que exporta una función que retorna `MetadataRoute.Manifest`.

**Configuración**:
```typescript
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
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
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
```

**Atajos de PWA**:
- Dashboard: `/dashboard/kanban`
- Tickets: `/dashboard/kanban`
- Usuarios: `/dashboard/users`

### 15.2 Service Worker
**Estado**: No implementado actualmente

**Nota**: El service worker fue eliminado. Para implementar funcionalidad offline completa, se puede agregar un service worker manualmente o usar una librería como `next-pwa`.

### 15.3 Configuración Next.js
**Ubicación**: `next.config.mjs`

**Nota**: Next.js maneja automáticamente el manifest generado desde `src/app/manifest.ts`, no requiere configuración de headers adicional.

### 15.4 Metadata PWA
**Estado**: No configurada actualmente en layout

**Nota**: La metadata PWA (themeColor, appleWebApp, icons, etc.) fue eliminada del layout. Next.js maneja automáticamente el manifest desde `src/app/manifest.ts`. Si se desea agregar metadata adicional en el HTML, se puede agregar en `src/app/layout.tsx`.

### 15.5 Iconos Requeridos
**Archivos disponibles en `public/icons/`**:
- `icon-192x192-maskable.png` - Icono 192x192px (maskable)
- `icon-512x512-maskable.png` - Icono 512x512px (maskable)
- `icon-180x180.png` - Icono Apple 180x180px
- Múltiples tamaños adicionales: 16x16, 32x32, 48x48, 64x64, 96x96, 128x128, 144x144, 152x152, 384x384

**Rutas configuradas**:
- Manifest: `/icons/icon-192x192-maskable.png` y `/icons/icon-512x512-maskable.png`
- Shortcuts: `/icons/icon-192x192-maskable.png`

### 15.6 Características PWA
- **Instalable**: Puede instalarse en dispositivos móviles y escritorio (mediante manifest)
- **Responsive**: Optimizado para diferentes tamaños de pantalla
- **App-like**: Experiencia similar a app nativa (modo standalone)
- **Atajos**: Accesos directos a secciones principales
- **Offline**: No implementado actualmente (requiere service worker)

### 15.7 Testing PWA
**Para verificar la instalación PWA**:
1. Ejecutar `npm run build` y `npm start`
2. Abrir DevTools → Application → Manifest
3. Verificar que el manifest se carga correctamente
4. En móvil: verificar opción "Agregar a pantalla de inicio"
5. En Chrome Desktop: verificar icono de instalación en la barra de direcciones

**Lighthouse PWA Audit**:
- Ejecutar Lighthouse para verificar cumplimiento de criterios PWA
- Verificar: PWA installable, Service Worker, Manifest, HTTPS

---

## 16. Contacto y Contribuciones

**Contribuciones**: Bienvenidas mediante pull requests  
**Issues**: Reportar bugs y sugerencias en el repositorio  
**Discusión**: Canal de discusiones para propuestas

---

**Última Actualización**: Julio 2026  
**Versión del Documento**: 1.1
