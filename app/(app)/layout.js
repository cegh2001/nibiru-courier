import { AuthenticatedAppShell } from "@/layouts/AuthenticatedAppShell";

export default function AppLayout({ children }) {
  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
