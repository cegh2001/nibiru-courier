'use client';

import { UserMenu } from './UserMenu';
import { useSession } from "next-auth/react";
import { broadcastLogout } from "@/services/channels/authChannel";
import { MobileExchangeRate } from "@/layouts/components/MobileExchangeRate";

export const FloatingUserMenu = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const onLogout = (reason = "manual") => {
    broadcastLogout(reason);
  };

  if (!user) return null;

  return (
    <div className="absolute top-6 right-3.5 z-30 flex items-center gap-2">
      <div className="hidden lg:block">
        <UserMenu onLogout={onLogout} user={user} />
      </div>
      <div className="lg:hidden block">
        <MobileExchangeRate />
      </div>
    </div>
  );
};

