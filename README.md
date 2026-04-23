# Recolor Dashboard

Frontend dashboard para la plataforma de recolorización automotriz de vehículos.

## Tecnologías

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes)
- **TanStack Query** (estado y cache)
- **Lucide React** (íconos)

## Arquitectura

### Estructura de Carpetas
```
dashboard/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Layout protegido
│   │   │   ├── layout.tsx        # Sidebar + Topbar
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   └── [modules]/        # Páginas por módulo
│   │   ├── api/                  # API routes para proxy
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # Componentes shadcn
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── kpi-card.tsx
│   │   └── ...
│   ├── hooks/                    # Custom hooks
│   ├── lib/
│   │   ├── api.ts                # Cliente API
│   │   ├── types.ts              # Tipos TypeScript
│   │   └── utils.ts
│   └── ...
├── .env.local                    # Variables de entorno
└── package.json
```

### Diseño
- **Tema**: Premium dark SaaS
- **Layout**: Sidebar colapsable, topbar con búsqueda/notificaciones
- **Componentes**: Reutilizables, accesibles
- **Responsive**: Desktop-first con adaptación móvil

## Instalación y Ejecución

### Requisitos Previos
- Node.js 18+
- Backend FastAPI corriendo en `http://localhost:8000`

### Instalación Local
```bash
# En el directorio del microservicio
cd dashboard
npm install
```

### Variables de Entorno
Crear `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000
```

### Desarrollo Local
```bash
npm run dev
```
- Abre http://localhost:3000
- El servidor usa proxy API para desarrollo

### Build de Producción
```bash
npm run build
npm start
```

### Deploy en VPS
```bash
# Pull cambios
git pull

# Instalar dependencias
npm install

# Build
npm run build

# Ejecutar
npm start
```

## API Integration

### Proxy en Desarrollo
- Las llamadas API pasan por `/api/*` routes de Next.js
- En producción, configurables para directo al backend

### Endpoints Disponibles
- `/api/dashboard/kpis` - KPIs del dashboard
- `/api/dealers` - Lista de dealers
- Más endpoints en implementación...

## Módulos Implementados

### Fase 1 ✅
- **Dashboard**: KPIs y actividad reciente
- **Dealers**: Lista de dealers
- **Locations**: Cards visuales de locaciones
- **Base Assets**: Grid de assets base con previews
- **Color Specs**: Tabla de especificaciones
- **Color Assets**: Tabla de assets generados con previews
- **Monitoring**: Logs de procesamiento
- **Settings**: Configuración mock

### Próximas Fases
- **Inventory**: Gestión de inventory
- **Dealer Composed Assets**: Composiciones
- **Video Jobs**: Jobs de video

## Desarrollo

### Agregar Nueva Página
1. Crear carpeta en `src/app/(dashboard)/[module]/`
2. Crear `page.tsx`
3. Agregar hook en `src/hooks/`
4. Actualizar sidebar navigation

### Agregar API Route
1. Crear `src/app/api/[endpoint]/route.ts`
2. Implementar GET/POST handlers
3. Proxy a backend o mock

### Componentes
- Usar shadcn/ui para consistencia
- Seguir patrón de props TypeScript
- Mantener responsive

## Troubleshooting

### Backend no disponible
- El dashboard usa mocks automáticamente si el backend falla
- Revisar logs del navegador para errores API

### Build falla
- Asegurar Node.js 18+
- Limpiar `node_modules` y `npm install`

### Estilos no aplican
- Verificar Tailwind config
- Revisar imports en `globals.css`
