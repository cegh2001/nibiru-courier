"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, LogIn } from "lucide-react";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales inválidas. Intentá de nuevo.");
      return;
    }

    router.push("/inicio");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-light p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(66,141,232,0.15),transparent_60%)]" />

      <Card className="relative w-full max-w-md border-navy-lighter/30 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white shadow-lg">
            <Package className="h-7 w-7" />
          </div>
          <CardTitle className="font-title text-2xl text-navy">
            Nibiru Courier
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sistema de gestión de mensajería y última milla
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nibiru.courier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
            <p className="font-medium mb-2">Credenciales de prueba:</p>
            <div className="space-y-1">
              <p><strong>Admin:</strong> admin@nibiru.courier / admin123</p>
              <p><strong>Despachador:</strong> despachador@nibiru.courier / demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
