# Frontend - Portal Web Interno Microfinanciera

Portal web interno desarrollado con Next.js 14+ para la gestión de cuentas, tarjetas y solicitudes de crédito.

## Stack Tecnológico

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes UI)
- **React Query** (gestión de estado del servidor)
- **Recharts** (gráficos)
- **Sonner** (notificaciones toast)

## Instalación

```bash
cd frontend
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto `frontend/`:

```env
# Firebase Configuration (obtén estos valores de Firebase Console)
NEXT_PUBLIC_FIREBASE_WEB_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_WEB_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_WEB_APP_ID=tu-app-id

# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Nota:** Las variables de Firebase deben coincidir con las que ya tienes configuradas en la app móvil (mismo proyecto de Firebase).

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
frontend/
├── app/                    # Rutas de Next.js (App Router)
│   ├── accounts/          # Página de gestión de cuentas
│   ├── cards/             # Página de gestión de tarjetas
│   ├── applications/      # Página de solicitudes de crédito
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Dashboard principal
│   └── providers.tsx      # Providers de React Query
├── components/
│   ├── layout/            # Componentes de layout (Sidebar, Header)
│   └── ui/                 # Componentes UI de shadcn/ui
├── lib/
│   ├── api-client.ts       # Cliente API para comunicación con backend
│   └── hooks/
│       └── api.ts          # Hooks personalizados para React Query
└── public/                 # Archivos estáticos
```

## Funcionalidades Implementadas

### Dashboard
- Tarjetas de resumen (Total Balance, Total Spending)
- Gráfico de líneas con tendencias mensuales (Earning/Expenses)
- Tabla de transacciones recientes

### Gestión de Cuentas
- Listado con filtros (estado, zona, tipo)
- Aprobar/Rechazar cuentas pendientes
- Bloquear/Activar cuentas activas
- Cerrar cuentas
- Diálogos modales para acciones

### Gestión de Tarjetas
- Listado con filtros (estado, tipo)
- Aprobar/Rechazar tarjetas pendientes
- Suspender/Reactivar tarjetas activas
- Cerrar tarjetas
- Diálogos modales con validación de motivos

### Solicitudes de Crédito
- Listado con filtros (estado, zona, producto)
- Asignación a analistas
- Visualización de score crediticio
- Navegación a vista de detalle

## Autenticación

El sistema utiliza **Firebase Auth** para autenticación, igual que la app móvil:

- **Login con Email/Password**: Formulario tradicional
- **Login con Google**: Autenticación social
- **Registro**: Creación de cuenta con validación
- **Protección de rutas**: Todas las páginas del dashboard requieren autenticación
- **Tokens JWT**: Se almacenan automáticamente en localStorage para las peticiones al backend

### Páginas de Autenticación

- `/login` - Página de inicio de sesión
- `/register` - Página de registro

Las páginas protegidas redirigen automáticamente a `/login` si el usuario no está autenticado.

## Integración con Backend

El frontend se comunica con el backend mediante el cliente API configurado en `lib/api-client.ts`. Todos los endpoints están documentados en el backend.

## Próximos Pasos

- [ ] Implementar autenticación Firebase completa
- [ ] Agregar protección de rutas por roles
- [ ] Implementar vistas de detalle completas
- [ ] Agregar exportación CSV/Excel
- [ ] Mejorar gráficos con más métricas
- [ ] Agregar paginación en listados
- [ ] Implementar búsqueda avanzada
