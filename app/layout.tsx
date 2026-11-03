import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oferta exclusiva | Barceló Guatemala City",
  description:
    "Regístrate y recibe un cupón de bienvenida para tu próxima estancia en Barceló Guatemala City.",
  icons: { icon: "/icono.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Slab:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
