# Nibiru Courier

Sistema de gestión de courier y mensajería para logística de última milla.

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@nibiru.courier | admin123 |
| Despachador | despachador@nibiru.courier | demo123 |

## 📚 Documentación

- [Plan de Desarrollo](docs/PLAN.md) — Arquitectura, estructura y guía de desarrollo
- [Mapeo de Dominio](docs/DOMAIN-MAPPING.md) — Comparación G-Aereo → Nibiru Courier
- [Roadmap](docs/ROADMAP.md) — Fases de implementación y tareas

## 🏗️ Stack

Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui · SWR · Zustand · NextAuth.js · Leaflet

## 📁 Estructura

```
src/
├── modules/     # Dominio de negocio (operations, finance, admin...)
└── shared/      # Infraestructura reusable (components, hooks, layouts...)
app/             # Next.js App Router (solo ruteo)
docs/            # Documentación de planificación
```

## ⚠️ Proyecto en desarrollo

Este es un **frontend maquetado** con datos mock. No requiere backend. Para detalles del estado actual y próximos pasos, ver [docs/PLAN.md](docs/PLAN.md).
