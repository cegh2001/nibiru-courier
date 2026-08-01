# Nibiru Courier — Mapeo de Dominio

> Comparación detallada de conceptos entre G-Aereo (carga aérea) y Nibiru Courier (mensajería última milla).

---

## Flujo Operativo Comparado

### G-Aereo (Importación)
```
Manifiesto → Inspección AVSEC → Recepción → Acta de Recepción → Inventario → Control ULD
```

### Nibiru Courier
```
Orden/Envío → Asignar Conductor → Pickup → En Tránsito (tracking) → Entregado (POD)
```

---

## Tabla de Conceptos

| # | G-Aereo | Nibiru Courier | Complejidad Relativa | Notas |
|---|---------|---------------|---------------------|-------|
| 1 | Manifiesto (MAW) | Envío / Shipment | 🔽 Más simple | Sin jerarquía MAW→HAW. Un envío = un paquete con un destino. |
| 2 | Guía Hija (HAW) | ❌ No existe | — | No hay sub-guías en courier estándar |
| 3 | Vuelo | Ruta de entrega | 🔄 Diferente | Una ruta tiene múltiples paradas (stops), no un origen-destino fijo |
| 4 | Aerolínea | Transportista / Carrier | 🔽 Más simple | Menos atributos (sin logo, sin flota compleja) |
| 5 | Aeropuerto | Hub / Sucursal | 🔽 Más simple | Sin IATA, sin tipo de aeropuerto |
| 6 | Avión | Vehículo | 🔄 Diferente | Moto, auto, camioneta, bici. Sin modelo de avión ni matrícula. |
| 7 | Almacén | Hub / Bodega | ✅ Similar | Mismo concepto: lugar físico donde se guarda mercadería |
| 8 | Cliente | Cliente / Remitente | ✅ Similar | Sin RIF ni datos fiscales complejos |
| 9 | Agente de Aduana | ❌ No existe | — | No hay despachante de aduana en courier local |
| 10 | Inspección AVSEC | ❌ No existe | — | No hay inspección de seguridad aeroportuaria |
| 11 | Inspección 360 | Inspección de paquete | 🔽 Mucho más simple | Solo foto del paquete al recibir/entregar |
| 12 | Recepción | Pickup | ✅ Similar | Registrar que se recibe un paquete en origen |
| 13 | Acta de Recepción | Hoja de ruta / Manifiesto | 🔽 Más simple | Documento que lista los envíos de una ruta |
| 14 | Precintaje | ❌ Simplificado | 🔽 Más simple | Sin sellos de seguridad complejos. Solo tracking number. |
| 15 | Pase de Salida | Proof of Delivery | 🔄 Diferente | En vez de autorización de salida, es comprobante de entrega (foto, firma) |
| 16 | Inventario | Inventario de Hub | ✅ Similar | Misma lógica: qué hay en cada sucursal |
| 17 | ULD | ❌ No existe | — | Contenedores aéreos no aplican |
| 18 | Stack ULD | ❌ No existe | — | No hay stacking de contenedores |
| 19 | FlightRadar24 | Leaflet/OSM | 🔄 Diferente | En vez de tracking de vuelos, mapa de conductores en tiempo real |
| 20 | Truck Driver | Conductor / Rider | 🔄 Diferente | Con ubicación GPS, foto, rating. Más atributos. |
| 21 | Truck Company | Flota | 🔽 Más simple | Puede ser propia o tercerizada |
| 22 | Órdenes de Servicio | Órdenes de Servicio | 🔽 Más simple | Sin conceptos aduaneros |
| 23 | Pre-liquidaciones | ❌ No existe | — | No hay pre-liquidación aduanera |
| 24 | Facturas | Facturas | 🔽 Más simple | Sin impuestos de comercio exterior |
| 25 | Pagos | Pagos | ✅ Similar | Misma lógica |
| 26 | Avisos de Crédito | Notas de Crédito | ✅ Similar | |
| 27 | Tipos de Autoridad AVSEC | ❌ No existe | — | |
| 28 | Currency Exchange | ❌ No necesario | — | Generalmente moneda local |

---

## Lo que se ELIMINA (no tiene equivalente en courier)

- ❌ Todo el flujo AVSEC (inspecciones, autoridades, declaraciones)
- ❌ ULDs (Unit Load Devices)
- ❌ Aerolíneas, aviones, aeropuertos
- ❌ Vuelos y FlightRadar24
- ❌ Agentes de aduana
- ❌ Guías hijas (HAW)
- ❌ Precintaje de almacén
- ❌ Control Dispatch AVSEC
- ❌ Pre-liquidaciones complejas

## Lo que se AGREGA (no existe en aéreo)

- 🆕 Mapa en tiempo real con Leaflet/OSM
- 🆕 Tracking GPS de conductores
- 🆕 Optimización de rutas multi-stop
- 🆕 ETA predictivo
- 🆕 Proof of Delivery (foto + firma)
- 🆕 Tracking público para cliente final
- 🆕 Ventanas horarias de entrega
- 🆕 Zonas de cobertura geográfica
- 🆕 App de conductor (fase 2)
- 🆕 Rating de conductores
