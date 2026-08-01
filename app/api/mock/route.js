import { NextResponse } from "next/server";

/**
 * Mock API Handler - Intercepta todas las llamadas a /api/mock/*
 * y devuelve datos de prueba para desarrollo sin backend.
 */

// Mock data store (en memoria)
const mockDb = {
  shipments: [
    { id: 1, tracking: "NIB-001", client: "TechCorp SA", origin: "Oficina Central", destination: "Av. Corrientes 1234, CABA", status: "entregado", driver: "Carlos M.", priority: "alta", createdAt: "2026-07-31T08:00:00Z" },
    { id: 2, tracking: "NIB-002", client: "Moda Express", origin: "Depósito Norte", destination: "Calle Florida 567, CABA", status: "en_transito", driver: "Ana R.", priority: "normal", createdAt: "2026-07-31T09:30:00Z" },
    { id: 3, tracking: "NIB-003", client: "FarmaSalud", origin: "Hub Centro", destination: "Av. Santa Fe 890, CABA", status: "pendiente", driver: null, priority: "alta", createdAt: "2026-07-31T10:00:00Z" },
    { id: 4, tracking: "NIB-004", client: "Libros Ya", origin: "Oficina Central", destination: "Calle Lavalle 432, CABA", status: "entregado", driver: "Diego P.", priority: "normal", createdAt: "2026-07-31T07:15:00Z" },
    { id: 5, tracking: "NIB-005", client: "ElectroHogar", origin: "Depósito Sur", destination: "Av. Cabildo 2100, CABA", status: "en_transito", driver: "Carlos M.", priority: "baja", createdAt: "2026-07-31T08:45:00Z" },
  ],
  drivers: [
    { id: 1, name: "Carlos Méndez", vehicle: "Moto - ABC123", status: "en_ruta", zone: "Centro", phone: "+54 11 5555-0101" },
    { id: 2, name: "Ana Rodríguez", vehicle: "Auto - DEF456", status: "en_ruta", zone: "Norte", phone: "+54 11 5555-0102" },
    { id: 3, name: "Diego Pereira", vehicle: "Moto - GHI789", status: "disponible", zone: "Sur", phone: "+54 11 5555-0103" },
    { id: 4, name: "Laura Gómez", vehicle: "Camioneta - JKL012", status: "descanso", zone: "Oeste", phone: "+54 11 5555-0104" },
    { id: 5, name: "Martín Suárez", vehicle: "Bici - MNO345", status: "disponible", zone: "Centro", phone: "+54 11 5555-0105" },
  ],
  routes: [
    { id: 1, name: "Ruta Centro Mañana", driver: "Carlos Méndez", stops: 12, status: "activa", zone: "Centro", eta: "13:30" },
    { id: 2, name: "Ruta Norte Tarde", driver: "Ana Rodríguez", stops: 8, status: "activa", zone: "Norte", eta: "15:00" },
    { id: 3, name: "Ruta Sur Express", driver: null, stops: 5, status: "planificada", zone: "Sur", eta: "--" },
  ],
  clients: [
    { id: 1, name: "TechCorp SA", type: "empresa", phone: "+54 11 4444-0101", address: "Av. del Libertador 4500" },
    { id: 2, name: "Moda Express", type: "comercio", phone: "+54 11 4444-0102", address: "Av. Santa Fe 3200" },
    { id: 3, name: "FarmaSalud", type: "empresa", phone: "+54 11 4444-0103", address: "Av. Rivadavia 7800" },
  ],
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");

  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  switch (resource) {
    case "shipments":
      return NextResponse.json({ data: mockDb.shipments });
    case "drivers":
      return NextResponse.json({ data: mockDb.drivers });
    case "routes":
      return NextResponse.json({ data: mockDb.routes });
    case "clients":
      return NextResponse.json({ data: mockDb.clients });
    default:
      return NextResponse.json({ data: [] });
  }
}

export async function POST(request) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const body = await request.json();

  return NextResponse.json({
    data: { id: Date.now(), ...body },
    message: "Recurso creado exitosamente (mock)",
  });
}
