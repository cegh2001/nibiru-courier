# Nibiru Courier — Roadmap

> Plan de implementación por fases. Cada fase es un milestone independiente.

---

## 🟢 Fase 1: Shell y Core (COMPLETADA ✅)

**Objetivo:** Proyecto funcionando con infraestructura lista para desarrollar features.

- [x] Inicializar proyecto Next.js 16 con stack g-aereo
- [x] Copiar y adaptar infraestructura shared
- [x] Configurar ESLint, Tailwind, Vitest
- [x] Login con NextAuth mock
- [x] Dashboard con datos mock
- [x] API mock endpoint
- [x] Estructura de rutas definida
- [x] Navegación y sidebar con módulos courier
- [x] Documentación de planificación

**Estimado:** ✅ Completado

---

## 🟡 Fase 2: Operaciones Básicas (Sprint 1-2)

**Objetivo:** CRUD completo de las entidades core del negocio.

### Tareas

#### 2.1 — CRUD de Envíos
- [ ] `src/modules/operations/shipments/` — módulo de envíos
- [ ] `ShipmentsList.jsx` — tabla con filtros (estado, fecha, conductor)
- [ ] `ShipmentForm.jsx` — formulario crear/editar (react-hook-form + Zod)
- [ ] `ShipmentDetail.jsx` — vista detalle con timeline de estados
- [ ] `useShipments.js` — hook SWR para consumir mock API
- [ ] Páginas en `app/(app)/operaciones/envios/`

#### 2.2 — CRUD de Conductores
- [ ] `src/modules/operations/drivers/` — módulo de conductores
- [ ] `DriversList.jsx` — tabla con estados (disponible, en ruta, descanso)
- [ ] `DriverForm.jsx` — formulario con vehículo, zona, teléfono
- [ ] `DriverDetail.jsx` — perfil con historial de envíos
- [ ] Páginas en `app/(app)/conductores/`

#### 2.3 — CRUD de Clientes
- [ ] Adaptar `src/modules/brokers/` (ya existe clients)
- [ ] `ClientsList.jsx` — simplificado, sin datos de aduana
- [ ] Páginas en `app/(app)/clientes/`

#### 2.4 — Asignación Envío → Conductor
- [ ] `AssignDriverDialog.jsx` — modal para asignar conductor a envío
- [ ] Cambio de estado automático (pendiente → asignado)
- [ ] Vista de envíos asignados por conductor

**Estimado:** 8-10 días

---

## 🟡 Fase 3: Rutas y Mapas (Sprint 3-4)

**Objetivo:** Tracking visual y gestión de rutas con mapa interactivo.

### Tareas

#### 3.1 — Mapa base Leaflet
- [ ] `MapView.jsx` — componente mapa con react-leaflet
- [ ] `DriverMarker.jsx` — marcador de conductor en mapa
- [ ] `ShipmentMarker.jsx` — marcador de envío/parada
- [ ] `MapControls.jsx` — zoom, centrar, filtros de capa

#### 3.2 — Gestión de Rutas
- [ ] `src/modules/operations/routes/` — módulo de rutas
- [ ] `RoutesList.jsx` — lista de rutas del día
- [ ] `RouteDetail.jsx` — vista con mapa y lista de paradas
- [ ] `RouteBuilder.jsx` — crear ruta seleccionando envíos y ordenando paradas
- [ ] Drag & drop para reordenar stops
- [ ] `useRoutes.js` — hook SWR

#### 3.3 — Mapa Operativo (Command Center)
- [ ] `OperationalMap.jsx` — mapa grande con todos los conductores y envíos
- [ ] Actualización periódica (polling cada 30s al mock)
- [ ] Leyenda de estados por color
- [ ] Click en marcador → drawer con detalle

#### 3.4 — ETA Estimado
- [ ] Cálculo mock de ETA basado en distancia lineal
- [ ] Mostrar ETA en detalle de envío y tracking público

**Estimado:** 10-12 días

---

## 🟡 Fase 4: Tracking y POD (Sprint 5)

**Objetivo:** Experiencia de seguimiento para cliente final y comprobante de entrega.

### Tareas

#### 4.1 — Tracking Público
- [ ] `app/tracking/[id]/page.js` — página pública sin auth
- [ ] `TrackingView.jsx` — mapa + timeline de estados
- [ ] Datos mock del envío (tracking number, ETA, ubicaciones)
- [ ] Diseño responsive mobile-first

#### 4.2 — Proof of Delivery
- [ ] `PodCapture.jsx` — componente para tomar foto
- [ ] `SignaturePad.jsx` — firma digital en canvas
- [ ] `PodViewer.jsx` — ver POD en detalle de envío
- [ ] Integrar en flujo de entrega

#### 4.3 — Notificaciones Mock
- [ ] Sistema de notificaciones toast (ya existe con react-hot-toast)
- [ ] Simular eventos: "Envío en camino", "Envío entregado"
- [ ] `NotificationCenter.jsx` — campanita con historial

**Estimado:** 6-8 días

---

## 🟡 Fase 5: Finanzas (Sprint 6)

**Objetivo:** Facturación y cobros simplificados.

### Tareas

#### 5.1 — Tarifas
- [ ] `src/modules/finance/rates/` — tabla de tarifas por tipo de envío
- [ ] CRUD de tarifas (zona, peso, urgencia → precio)

#### 5.2 — Facturación
- [ ] `InvoicesList.jsx` — listado de facturas
- [ ] `InvoiceForm.jsx` — crear factura desde envíos entregados
- [ ] `InvoiceDetail.jsx` — detalle con items

#### 5.3 — Pagos
- [ ] `PaymentsList.jsx` — registro de pagos
- [ ] `PaymentForm.jsx` — registrar pago (método, monto, referencia)

**Estimado:** 5-7 días

---

## 🔵 Fase 6: Pulido y Features Avanzadas (Sprint 7+)

- [ ] Bulk import de envíos (Excel)
- [ ] Reportes y analytics (Recharts)
- [ ] Zonas de cobertura con polígonos en mapa
- [ ] App de conductor PWA (fase 2)
- [ ] Notificaciones push reales
- [ ] Dark mode refinado
- [ ] Tests unitarios con Vitest
- [ ] Internacionalización (i18n)

---

## 📊 Resumen de Esfuerzo

| Fase | Días estimados | Prioridad |
|------|---------------|-----------|
| Fase 1: Shell | ✅ Done | — |
| Fase 2: Operaciones | 8-10 | 🔴 Crítica |
| Fase 3: Rutas/Mapas | 10-12 | 🔴 Crítica |
| Fase 4: Tracking/POD | 6-8 | 🟡 Alta |
| Fase 5: Finanzas | 5-7 | 🟡 Alta |
| Fase 6: Pulido | ∞ | 🟢 Media |
| **Total MVP (F1-F5)** | **~35 días** | |

---

## 🎯 Definición de MVP

El MVP se considera completo al finalizar la **Fase 4 (Tracking/POD)**. Con eso, el sistema permite:

1. Crear y gestionar envíos
2. Asignar conductores
3. Ver envíos y conductores en mapa
4. Tracking público para el cliente
5. Proof of delivery (foto + firma)

Las finanzas (Fase 5) son importantes pero pueden esperar si el foco inicial es operativo.
