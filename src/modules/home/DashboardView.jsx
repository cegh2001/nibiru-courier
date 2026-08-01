"use client";

import { useSession } from "next-auth/react";
import {
  Package,
  Truck,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data para el dashboard
const MOCK_STATS = {
  enviosHoy: 47,
  enTransito: 23,
  entregados: 18,
  pendientes: 6,
  conductoresActivos: 8,
  ingresosHoy: "$12,450.00",
  rutasActivas: 5,
};

const MOCK_ENTREGAS_RECIENTES = [
  { id: "ENV-001", cliente: "TechCorp SA", destino: "Av. Corrientes 1234", estado: "entregado", hora: "10:30" },
  { id: "ENV-002", cliente: "Moda Express", destino: "Calle Florida 567", estado: "en_transito", hora: "11:15" },
  { id: "ENV-003", cliente: "FarmaSalud", destino: "Av. Santa Fe 890", estado: "pendiente", hora: "--" },
  { id: "ENV-004", cliente: "Libros Ya", destino: "Calle Lavalle 432", estado: "entregado", hora: "09:45" },
  { id: "ENV-005", cliente: "ElectroHogar", destino: "Av. Cabildo 2100", estado: "en_transito", hora: "11:00" },
];

const estadoConfig = {
  entregado: { label: "Entregado", variant: "success", icon: CheckCircle2 },
  en_transito: { label: "En tránsito", variant: "default", icon: Truck },
  pendiente: { label: "Pendiente", variant: "secondary", icon: Clock },
};

export function DashboardView() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-title text-3xl font-bold text-navy">
            ¡Buen día, {session?.user?.name?.split(" ")[0] || "Usuario"}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Resumen operativo del día
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          <Clock className="mr-1 h-3.5 w-3.5" />
          Turno mañana
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Envíos Hoy"
          value={MOCK_STATS.enviosHoy}
          icon={Package}
          description={`${MOCK_STATS.pendientes} pendientes`}
          variant="primary"
        />
        <StatCard
          title="En Tránsito"
          value={MOCK_STATS.enTransito}
          icon={Truck}
          description={`${MOCK_STATS.rutasActivas} rutas activas`}
          variant="info"
        />
        <StatCard
          title="Entregados"
          value={MOCK_STATS.entregados}
          icon={CheckCircle2}
          description="Hoy"
          variant="success"
        />
        <StatCard
          title="Conductores"
          value={MOCK_STATS.conductoresActivos}
          icon={Users}
          description="Activos"
          variant="warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Entregas Recientes - ocupa 2 columnas */}
        <Card className="lg:col-span-2 border-navy-lighter/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="font-title text-lg">Últimos Envíos</CardTitle>
            <Badge variant="outline" className="text-xs">
              Ver todos
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Destino</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ENTREGAS_RECIENTES.map((envio) => {
                    const config = estadoConfig[envio.estado];
                    const StatusIcon = config.icon;
                    return (
                      <tr key={envio.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-medium text-navy">
                          {envio.id}
                        </td>
                        <td className="px-4 py-3 font-medium">{envio.cliente}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {envio.destino}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={config.variant} className="gap-1 text-xs">
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{envio.hora}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Ingresos */}
          <Card className="border-navy-lighter/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-title text-sm font-medium text-muted-foreground">
                Ingresos del Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-emerald" />
                <span className="font-title text-2xl font-bold text-navy">
                  {MOCK_STATS.ingresosHoy}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Próximos pasos */}
          <Card className="border-navy-lighter/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-title text-sm font-medium text-muted-foreground">
                Próximos Pasos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">6 envíos sin asignar</p>
                  <p className="text-amber-600">Asignar conductores para ruta centro</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3 text-sm">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Ruta Norte programada</p>
                  <p className="text-blue-600">Salida estimada: 14:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description, variant = "primary" }) {
  const variantStyles = {
    primary: "border-l-navy bg-navy/5",
    info: "border-l-blue-500 bg-blue-50",
    success: "border-l-emerald bg-emerald-50",
    warning: "border-l-amber-500 bg-amber-50",
  };

  return (
    <Card className={`border-l-4 shadow-sm transition-shadow hover:shadow-md ${variantStyles[variant]}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
          <Icon className="h-6 w-6 text-navy" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-title text-2xl font-bold text-navy">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
