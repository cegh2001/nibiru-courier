# Nibiru Courier — Plan de Desarrollo Frontend

> **Versión:** 1.0 — Julio 2026  
> **Proyecto base:** Adaptación de `gnavi-aereo` (g-aereo-front)  
> **Stack:** Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui + SWR + Zustand

---

## 🎯 Objetivo

Crear un sistema de gestión de courier y mensajería para logística de última milla, partiendo de la infraestructura frontend del sistema de carga aérea G-Aereo. Este proyecto es **frontend-only** con mock API. Todo el desarrollo se hace con datos simulados.

## 📦 Entregables del MVP

### Fase 1 — Shell y Operaciones Básicas (Sprint 1-2)
- [x] Proyecto inicializado con stack idéntico a g-aereo
- [x] Infraestructura shared copiada y adaptada (componentes, hooks, layouts, auth)
- [x] Login con NextAuth mock (usuarios de prueba)
- [x] Dashboard con KPIs de courier
- [ ] CRUD de Envíos (Shipments)
- [ ] CRUD de Conductores
- [ ] CRUD de Clientes
- [ ] Asignación de envío → conductor
- [ ] Listado de rutas del día

### Fase 2 — Tracking y Mapas (Sprint 3-4)
- [ ] Mapa operativo con Leaflet (ver conductores y envíos en tiempo real)
- [ ] Vista de ruta con paradas (multi-stop)
- [ ] Tracking de envío (página pública `/tracking/:id`)
- [ ] ETA estimado por parada
- [ ] Proof of Delivery (foto + firma + notas)

### Fase 3 — Finanzas y Reportes (Sprint 5-6)
- [ ] Tarifas por envío
- [ ] Facturación simple
- [ ] Reporte de envíos entregados
- [ ] Dashboard avanzado con Recharts

---

## 🏗️ Arquitectura

```
nibiru-courier/
├── app/
│   ├── (app)/                  # Rutas autenticadas
│   │   ├── layout.js           # AuthenticatedAppShell
│   │   ├── inicio/             # Dashboard
│   │   ├── operaciones/        # Envíos, pickups, entregas
│   │   ├── rutas/              # Planificación de rutas
│   │   ├── conductores/        # Gestión de conductores
│   │   ├── finanzas/           # Facturación y cobros
│   │   ├── datos-op/           # Catálogos (zonas, vehículos, hubs)
│   │   ├── admin/              # Usuarios, roles, permisos
│   │   └── clientes/           # Clientes
│   ├── (auth)/page.js          # Login
│   ├── tracking/[id]/          # Tracking público
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth mock
│       └── mock/route.js       # API mock para desarrollo
├── src/
│   ├── modules/                # Dominio de negocio
│   │   ├── home/               # Dashboard
│   │   ├── login/              # Login page
│   │   ├── operations/         # Envíos y entregas
│   │   ├── finance/            # Facturación
│   │   ├── admin/              # Admin (copia de g-aereo)
│   │   ├── brokers/            # Solo clientes
│   │   └── op-data/            # Catálogos courier
│   └── shared/                 # Infraestructura reusable (COPIADA)
│       ├── components/         # ui/ + common/ + animations/
│       ├── hooks/              # useData, useHybridCombobox, etc.
│       ├── services/           # apiClient, fetcher, roleAccess
│       ├── core/               # Providers, stores, session
│       ├── layouts/            # Shell, navbar, sidebar, breadcrumbs
│       ├── lib/                # utils, cn
│       └── utils/              # helpers, dates, strings, ui
├── docs/                       # Esta documentación
├── mocks/                      # Datos mock adicionales
└── public/                     # Estáticos
```

---

## 🔄 Mapeo de Dominio: Aéreo → Courier

| G-Aereo | Nibiru Courier | Estado |
|---------|---------------|--------|
| Manifiesto / Guía Aérea | Envío / Shipment | **Por crear** |
| Vuelo | Ruta de entrega | **Por crear** |
| Aerolínea | Transportista / Carrier | **Por crear** |
| Aeropuerto | Hub / Centro de distribución | Adaptar de Warehouses |
| Almacén | Sucursal / Bodega | **Ya existe** (warehouses) |
| Cliente | Cliente / Remitente | **Ya existe** (brokers/clientes) |
| Agente de Aduana | ❌ No aplica | Eliminado |
| Inspección AVSEC | ❌ No aplica | Eliminado |
| Recepción | Pickup / Recolección | **Por crear** |
| Precintaje | ❌ Simplificado | Eliminado |
| Pase de Salida | Proof of Delivery | **Por crear** |
| Inventario | Inventario de Hub | Adaptar |
| ULD | ❌ No aplica | Eliminado |
| FlightRadar24 | Leaflet/OpenStreetMap | **Por crear** |

---

## ✅ Lo que YA está hecho en esta instalación inicial

1. **Configuración completa del proyecto**: Next.js 16, Tailwind 4, shadcn/ui, ESLint, Vitest
2. **Infraestructura shared copiada**: 183+ archivos de componentes UI, hooks, layouts, servicios
3. **Autenticación mock**: NextAuth con usuarios de prueba (admin, despachador)
4. **Dashboard funcional**: KPIs de courier con tarjetas, tabla de envíos recientes
5. **API mock**: Endpoint `/api/mock` con datos de prueba (envíos, conductores, rutas)
6. **Login page**: Diseño moderno con branding Nibiru
7. **Theme system**: CSS variables, dark mode, animaciones

## 🚧 Lo que HAY QUE CONSTRUIR

### 1. Módulo de Operaciones (`src/modules/operations/`)

**Envíos (Shipments):**
- Listado de envíos con filtros (estado, fecha, conductor, zona)
- Crear/Editar envío (formulario con: cliente, origen, destino, paquete, prioridad, ventana horaria)
- Ver detalle de envío (tracking, historial de estados, POD)
- Cambiar estado (pendiente → asignado → en tránsito → entregado → cancelado)
- Bulk import (Excel/CSV)

**Pickups / Recolecciones:**
- Similar a recepción del aéreo
- Registrar recolección de paquete en origen
- Escanear código de barras / QR

### 2. Módulo de Rutas (`src/modules/operations/rutas/`)

- Crear ruta multi-stop (seleccionar envíos, ordenar paradas)
- Optimizar secuencia (drag & drop de paradas en mapa)
- Asignar ruta a conductor
- Vista de ruta con mapa Leaflet
- Seguimiento en tiempo real

### 3. Módulo de Conductores (`src/modules/conductores/`)

- CRUD de conductores (nombre, vehículo, zona, teléfono, documento)
- Estados: disponible, en_ruta, descanso, fuera_servicio
- Historial de envíos completados
- Rating / desempeño

### 4. Pantalla de Tracking Público (`app/tracking/[id]/`)

- Página sin auth
- Mapa con ubicación en tiempo real
- ETA estimado
- Estados del envío
- Datos del repartidor (nombre, foto)

### 5. Proof of Delivery

- Captura de foto al entregar
- Firma digital (canvas)
- Notas del conductor
- Timestamp automático

### 6. Catálogos nuevos (`src/modules/op-data/`)

- **Zonas de cobertura** (polígonos en mapa)
- **Tipos de vehículo** (moto, auto, camioneta, bici)
- **Hubs / Sucursales** (adaptar de warehouses)
- **Tipos de paquete** (sobre, caja, pallet)

### 7. Finanzas simplificado (`src/modules/finance/`)

- Tarifas por envío (basado en distancia, peso, urgencia)
- Facturación simple
- Registro de pagos
- Reporte de ingresos por período

---

## 🗺️ Plan de Rutas en App Router (páginas a crear)

```
app/(app)/
├── operaciones/
│   ├── envios/           # Listado de envíos
│   │   ├── page.js
│   │   ├── [id]/page.js  # Detalle de envío
│   │   └── nuevo/page.js # Crear envío
│   ├── rutas/
│   │   ├── page.js       # Listado de rutas
│   │   ├── [id]/page.js  # Detalle de ruta con mapa
│   │   └── nueva/page.js # Crear ruta
│   └── pickups/
│       └── page.js       # Recolecciones
├── conductores/
│   ├── page.js           # Listado
│   ├── [id]/page.js      # Detalle
│   └── nuevo/page.js     # Crear
├── finanzas/
│   ├── facturas/page.js
│   └── pagos/page.js
├── datos-op/
│   ├── zonas/page.js
│   ├── vehiculos/page.js
│   └── hubs/page.js
├── clientes/
│   ├── page.js
│   └── [id]/page.js
└── admin/
    ├── roles/page.js
    ├── usuarios/page.js
    └── permisos/page.js

app/
└── tracking/
    └── [id]/page.js      # Tracking público
```

---

## 📊 Modelo de Datos Mock

```js
// Envío / Shipment
{
  id: Number,
  tracking: String,        // "NIB-001"
  clientId: Number,
  clientName: String,
  origin: String,
  destination: String,
  packageType: String,     // "sobre" | "caja" | "pallet"
  weight: Number,          // kg
  priority: String,        // "baja" | "normal" | "alta"
  status: String,          // "pendiente" | "asignado" | "en_transito" | "entregado" | "cancelado"
  driverId: Number | null,
  routeId: Number | null,
  scheduledWindow: String, // "09:00-12:00"
  eta: String | null,
  pod: {                   // Proof of Delivery
    photo: String | null,
    signature: String | null,
    notes: String,
    timestamp: String | null
  },
  createdAt: String,
  updatedAt: String
}

// Conductor / Driver
{
  id: Number,
  name: String,
  vehicle: String,          // "Moto - ABC123"
  vehicleType: String,      // "moto" | "auto" | "camioneta" | "bici"
  zone: String,
  phone: String,
  status: String,           // "disponible" | "en_ruta" | "descanso" | "fuera_servicio"
  currentLocation: { lat: Number, lng: Number } | null,
  completedDeliveries: Number,
  rating: Number            // 1-5
}

// Ruta / Route
{
  id: Number,
  name: String,
  driverId: Number,
  stops: [
    { shipmentId: Number, address: String, order: Number, status: String }
  ],
  status: String,           // "planificada" | "activa" | "completada"
  zone: String,
  eta: String
}
```

---

## 🧩 Dependencias Nuevas (ya instaladas)

| Librería | Uso |
|----------|-----|
| `leaflet` + `react-leaflet` | Mapas interactivos (OpenStreetMap, gratis) |
| `leaflet-routing-machine` | Cálculo de rutas en mapa |
| `msw` | Mock Service Worker para interceptar llamadas API |

---

## 🚀 Cómo empezar a desarrollar

```bash
# 1. Clonar e instalar
git clone https://github.com/cegh2001/nibiru-courier.git
cd nibiru-courier
pnpm install

# 2. Iniciar en modo desarrollo
pnpm dev

# 3. Abrir http://localhost:3000
# Credenciales: admin@nibiru.courier / admin123
```

## 🔑 Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Super Admin | admin@nibiru.courier | admin123 |
| Despachador | despachador@nibiru.courier | demo123 |
| Conductor | conductor@nibiru.courier | demo123 |

---

## ⚠️ Notas importantes

1. **No hay backend**: todos los datos vienen del mock en `/api/mock` y de stores locales
2. **Las páginas de módulos (operaciones, rutas, conductores, etc.) NO existen aún** — solo está el shell y el dashboard
3. **Los layouts y navegación YA están cableados** a las rutas de arriba — solo hay que crear las páginas
4. **No modificar `src/shared/`** a menos que sea estrictamente necesario — ya está probado y funciona
5. **Seguir el patrón existente**: `app/` solo rutea → `src/modules/` tiene toda la lógica

---

## 📝 Convenciones

- Nombres de archivo: PascalCase para componentes, camelCase para hooks/utils
- Imports absolutos con alias (`@/components/*`, `@/hooks/*`, `@/modules/*`)
- Formularios: react-hook-form + Zod + shadcn/ui
- Data fetching: SWR con `useData()` hook → apuntar a `/api/mock?resource=X`
- Estado local: Zustand
- No introducir TypeScript (JSX puro)
- Seguir reglas de accesibilidad de AGENTS.md
