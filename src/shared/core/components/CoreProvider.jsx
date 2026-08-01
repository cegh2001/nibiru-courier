"use client";
// Core
import { SessionStatus } from "@/core/components/SessionStatus";
import { MotionProvider } from "@/core/components/MotionProvider";
// Next
import { SessionProvider } from "next-auth/react";

export const CoreProvider = ({ children }) => (
  <SessionProvider
    refetchInterval={60}
    refetchOnWindowFocus
    refetchWhenOffline={false}
  >
    <MotionProvider>
      <SessionStatus>{children}</SessionStatus>
    </MotionProvider>
  </SessionProvider>
);