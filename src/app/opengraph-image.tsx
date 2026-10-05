import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { consultorio, sedePrincipal } from "@/content/consultorio";

/**
 * Imagen que aparece al compartir el link (WhatsApp, Instagram, Facebook).
 * Satori no lee woff2, por eso van los .woff en src/fonts/og.
 */
export const alt = "Ecolun · Ecografías en Córdoba";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fuente = (archivo: string) => readFile(join(process.cwd(), "src/fonts/og", archivo));

/** Logo horizontal con letras blancas (983 × 218). */
const LOGO = { ancho: 983, alto: 218 } as const;

export default async function Image() {
  const [light, bold, logo] = await Promise.all([
    fuente("poppins-latin-300-normal.woff"),
    fuente("poppins-latin-700-normal.woff"),
    readFile(join(process.cwd(), "src/assets/logo-ecolun-blanco.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        color: "white",
        fontFamily: "Poppins",
        background: "linear-gradient(200deg, #6dacb1 0%, #4f9197 45%, #3d7980 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -160,
          top: -160,
          width: 620,
          height: 620,
          borderRadius: 9999,
          border: "90px solid rgba(255,255,255,0.1)",
        }}
      />
      <img src={logoSrc} alt="" width={LOGO.ancho * 0.28} height={LOGO.alto * 0.28} />
      <div style={{ fontSize: 78, fontWeight: 300, marginTop: 34, lineHeight: 1.1 }}>Acompañamos tu embarazo</div>
      <div style={{ display: "flex", marginTop: 18 }}>
        <div
          style={{
            fontSize: 78,
            fontWeight: 700,
            background: "#90c3a2",
            color: "#1f4649",
            borderRadius: 22,
            padding: "0 26px 8px",
            transform: "rotate(-2deg)",
          }}
        >
          eco a eco
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 300, marginTop: 44, opacity: 0.92 }}>
        {`${consultorio.eslogan} · ${sedePrincipal.direccion}`}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Poppins", data: light, weight: 300, style: "normal" },
        { name: "Poppins", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
