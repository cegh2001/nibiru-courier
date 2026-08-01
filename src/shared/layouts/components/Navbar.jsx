"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RecentVisitsButton } from "@/layouts/components/RecentVisitsButton";

export const Navbar = () => {
  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-sm shadow-navy-lighter border border-gray-200/50 rounded-full px-3 sm:px-4 py-2 h-[60px] flex items-center overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          className="rounded-full px-2 sm:px-3 py-2 hover:bg-blue-50 h-8 sm:h-9"
          asChild
        >
          <Link href="/inicio" className="flex items-center gap-2">
            <Image
              src="/assets/isotipo-light.png"
              width={22}
              height={22}
              alt="Logo G-Aéreo"
              className="object-contain sm:w-6 sm:h-6"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>
        </Button>
      </div>

      <div className="mx-2 sm:mx-3 w-px h-5 sm:h-6 bg-gray-300" />

      <div className="flex items-center gap-1 sm:gap-2">
        <RecentVisitsButton />
      </div>
    </div>
  );
};
