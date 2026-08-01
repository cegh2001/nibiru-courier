import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { getAllowedSections } from '@/services/roleAccess';
import { sidebarItems } from '@/services/navigationConfig';

export function useRoleNavigation() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const sections = useMemo(
    () => isLoading ? new Set(['inicio', 'operaciones', 'rutas', 'conductores', 'datos-op', 'finanzas', 'admin']) : getAllowedSections(session?.user?.roles),
    [session?.user?.roles, isLoading],
  );

  const filteredSidebarItems = useMemo(() => {
    const sectionMap = {
      Inicio: 'inicio',
      Operaciones: 'operaciones',
      Rutas: 'rutas',
      Conductores: 'conductores',
      'Datos Operativos': 'datos-op',
      Finanzas: 'finanzas',
      Admin: 'admin',
    };

    return sidebarItems.reduce((acc, item) => {
      const section = sectionMap[item.text];
      if (section) {
        if (sections.has(section)) acc.push(item);
        return acc;
      }

      acc.push(item);
      return acc;
    }, []);
  }, [sections]);

  const hasSection = (section) => sections.has(section);

  return {
    sections,
    isLoading,
    filteredSidebarItems,
    hasSection,
  };
}
