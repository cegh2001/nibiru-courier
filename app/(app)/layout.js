import { AuthenticatedAppShell } from "@/layouts/components/shell/AuthenticatedAppShell";

export default function AppLayout({ children }) {
  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
