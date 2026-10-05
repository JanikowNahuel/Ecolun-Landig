import type { Metadata, Viewport } from "next";
import { Proveedores } from "@/components/layout/proveedores";
import { SEO, SITE_URL } from "@/lib/seo";
import { gochi, poppins } from "./fuentes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.titulo,
  description: SEO.descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Ecolun",
    title: SEO.titulo,
    description: SEO.descripcion,
    url: "/",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4f9197",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${poppins.variable} ${gochi.variable}`}>
      <body className="antialiased">
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  );
}
