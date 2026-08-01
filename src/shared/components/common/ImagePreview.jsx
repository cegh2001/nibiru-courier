"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ImagePreview({ src, alt, width, height, number }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <div className="cursor-pointer relative">
            <Dialog>
              <DialogTitle className="sr-only">Imagen {number}</DialogTitle>
              <DialogDescription className="sr-only">
                Previsualización de la imagen
              </DialogDescription>
              <DialogTrigger asChild>
                <div className="relative w-max">
                  <ImageIcon className="w-6 h-6" />
                  {/* Número de imagen */}
                  <span className="absolute -top-2 -right-2 bg-navy text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {number}
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-full p-0">
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={src || "/assets/gonavi-logo.png"}
                    alt={alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <div
            className="relative"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <Image
              src={src || "/assets/gonavi-logo.png"}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
