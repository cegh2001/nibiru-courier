'use client';

/* Components */
import { Menu, MenuItems, MenuItem, Transition } from '@headlessui/react';
/* Core */
import { AuthGuard } from '@/core/components/AuthGuard';
/* Icons */
import { PiSignOutBold } from "react-icons/pi";
import { TbUser, TbShield, TbMail } from 'react-icons/tb';
/* Hooks */
import { Fragment } from 'react';
/* Next */
import Link from 'next/link';
import { useSession } from 'next-auth/react';
// Stores
import { useUserMenuStore } from '@/layouts/components/menus/stores/userMenuStore';

export const UserMenu = ({ onLogout, user }) => {
  /* Estado de Apertura del Menú */
  const { open, setOpen } = useUserMenuStore();
  const { data: session } = useSession();

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Botón de Apertura del Menú con Inicial del Usuario */}
      <button
        className="max-w-xs flex items-center justify-center bg-navy rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={() => setOpen(!open)}
      >
        <div className="w-10 h-10 flex items-center justify-center text-navy-lighter text-xl font-extrabold">
          {user?.name.charAt(0).toUpperCase()}
        </div>
      </button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={open}
      >
        {/* Menú */}
        <MenuItems className="mt-2 py-fit w-64 absolute z-30 origin-top-right top-8 right-6 bg-white shadow-lg ring-2 ring-black/10 focus:outline-hidden rounded-xl">
          <div className="p-fit block text-center">
            <div className="triangle -rotate-90 -translate-y-[20.5px] translate-x-[224.6px]"></div>
            <div className="mb-3 flex items-center justify-center">
              <div className="p-2 bg-navy-lighter/50 rounded-full">
                <TbUser className="w-10 h-10 text-navy" />
              </div>
            </div>
            <div className="mx-auto mt-3 w-52 flex items-center justify-center text-navy-dark text-xl font-bold">
              {user?.name}
            </div>
            <div className="my-0.5 inline-flex items-center text-navy-dark text-xs font-medium">
              <TbMail className="mr-1.5 w-4 h-4 text-amber-400" /> {user?.email}
            </div>

            {/* Botón de Acceso a Roles y Permisos */}
            <AuthGuard roles={["super-admin"]}>
              <Link href="/admin/roles">
                <button
                  onClick={() => setOpen(!open)}
                  className="my-3 inline-flex items-center rounded-full pl-2 pr-3 py-1 text-xs text-navy font-medium bg-white 
                shadow-sm shadow-navy-light hover:scale-105 hover:bg-navy hover:text-white hover:shadow-md hover:shadow-navy-light duration-300"
                >
                  <TbShield className="mr-1.5 w-4 h-4" /> Roles y Permisos
                </button>
              </Link>
            </AuthGuard>

            {/* Botón de Logout */}
            <MenuItem>
              {() => (
                <div className="mt-3 bg-blue-50 rounded-b-xl">
                  <button
                    className="px-6 py-2 w-full inline-flex justify-center items-center rounded-b-lg text-crimson-light/80 text-md font-semibold duration-300 hover:bg-crimson-light hover:text-white"
                    onClick={() => {
                      onLogout("manual");
                      setOpen(!open);
                    }}
                    type="button"
                  >
                    <PiSignOutBold className="mx-1.5" /> Salir
                  </button>
                </div>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
