import { Inter, Outfit } from "next/font/google";
import { CoreProvider } from "@/core/components/CoreProvider";
import { ThemeFoucHandler } from "@/components/common/ThemeFoucHandler";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Nibiru Courier",
  description: "Sistema de gestión de courier y mensajería - Logística de última milla",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeFoucHandler />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <CoreProvider>{children}</CoreProvider>
      </body>
    </html>
  );
}
