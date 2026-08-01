import { TbLockAccess } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-crimson/10 border border-crimson/20">
        <TbLockAccess className="w-8 h-8 text-crimson" />
      </div>
      <h2 className="text-lg font-semibold text-navy">Acceso restringido</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        No tienes permisos para acceder a esta sección. Contacta al administrador si crees que es un error.
      </p>
      <Button variant="outline" size="sm" onClick={() => router.push('/inicio')}>
        Volver al inicio
      </Button>
    </div>
  );
}
