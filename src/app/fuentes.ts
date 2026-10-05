import localFont from "next/font/local";

/**
 * Poppins (principal) y Gochi Hand (acento manuscrito: el epígrafe de la polaroid).
 * Van en el repo para no depender de Google Fonts al compilar. Licencia OFL.
 */
export const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../fonts/poppins-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const gochi = localFont({
  variable: "--font-gochi",
  display: "swap",
  src: [{ path: "../fonts/gochi-hand-latin-400-normal.woff2", weight: "400", style: "normal" }],
});
