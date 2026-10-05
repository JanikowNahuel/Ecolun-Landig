# Ecolun · Landing pública

Sitio informativo del consultorio (Dra. Luna, Av. Vélez Sarsfield 3347, Córdoba).
Proyecto **aparte** de `ecolun-nextjs` (la app de turnos): no comparte código ni
base de datos, así un cambio acá nunca rompe la agenda.

Next.js 16 (App Router, Turbopack) · TypeScript strict · Tailwind v4 ·
Framer Motion · Lucide. Todo se genera estático (`○` en el build).

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run verificar  # 20 chequeos de la lógica de la animación
npm run typecheck
npm run lint
npm run build
```

## Dónde se edita el contenido

Todo el texto y los datos viven en `src/content/`, nunca en los componentes:

| Archivo | Qué tiene |
| --- | --- |
| `consultorio.ts` | Teléfono, WhatsApp, Instagram, sedes, horarios, obras sociales, reseñas, datos de la doctora |
| `estudios.ts` | Lista de ecografías y su preparación |
| `embarazo.ts` | Las 4 etapas de la animación y los mitos/verdades |
| `navegacion.ts` | Links del menú |

### Pendiente de completar (buscar `TODO` en `consultorio.ts` y `estudios.ts`)

- [ ] Horarios de atención.
- [ ] Obras sociales / prepagas.
- [ ] (Opcional) Matrícula de la doctora.
- [ ] Revisar la lista de estudios con la doctora.

Ya cargado: WhatsApp, sede única (Vélez Sarsfield), Dra. Daniela Luna, su foto,
el logo y 4 reseñas reales de Google.

### Imágenes

Van en `src/assets/` y se importan desde el código (Next las optimiza y les
pone el tamaño solo):

| Archivo | Uso |
| --- | --- |
| `logo-ecolun.png` | Logo horizontal original (header al scrollear) |
| `logo-ecolun-blanco.png` | Mismo logo con las letras en blanco (header sobre el teal, pie, imagen para compartir) |
| `doctora.jpg` | Retrato recortado de la captura del video, sin los textos |

`src/app/icon.svg` (pestaña del navegador) y `src/app/apple-icon.png` (ícono
en el iPhone) salen del símbolo del logo. Para cambiar la foto, reemplazá
`doctora.jpg` por otra en formato vertical 4:5.

## Cómo está armado

```
src/
  app/            layout, página, robots, sitemap, imagen para compartir, ícono
  assets/         logo y foto (ver arriba)
  content/        datos editables (ver arriba)
  components/
    embarazo/     la animación con scroll (monitor del ecógrafo + textos + barra)
    hero/         hero y polaroid
    secciones/    estudios, doctora, mitos, opiniones, contacto
    layout/       header, cierre con casquete + pie, botón flotante
    ui/           piezas de la guía de marca (resaltado, píldora, arcos, botón…)
  hooks/          scroll → atributos SVG, opacidad por etapa, reducir movimiento
  lib/            lógica pura (línea de tiempo, geometría del abanico, SEO, WhatsApp)
  fonts/          Poppins y Gochi Hand en el repo (no depende de Google Fonts)
scripts/
  verificar-logica.ts
```

**La animación.** `RecorridoEmbarazo` mide 4,6 pantallas de alto y su contenido
queda fijo (sticky). `useScroll` da un único progreso de 0 a 1 y todo sale de
ahí: la semana del monitor, el tamaño de la bolsa, el paso de embrión a feto,
los calipers de cada estudio, el doppler, los textos y la barra segmentada.
Las transformaciones del SVG se escriben directo en el atributo (sin re-render
de React). El grano del ecógrafo es una capa fija aparte para que el filtro no
se recalcule en cada cuadro.

**Accesibilidad.** Con "reducir movimiento" activo en el sistema se muestra una
versión estática (un monitor quieto por etapa). El teal principal con texto
blanco da 3,6:1, por eso el texto chico va sobre `teal-profundo` y el resaltado
menta lleva texto oscuro en vez de blanco.

**Reseñas.** Con la lista vacía, la sección muestra solo la calificación y el
link a Google. No cargar reseñas inventadas ni editadas.

**SEO.** HTML renderizado en el servidor, datos estructurados `MedicalClinic`
(sin `aggregateRating`: Google no lo acepta para reseñas propias), imagen para
compartir por WhatsApp/Instagram, `robots.txt` y `sitemap.xml`.

## Deploy en Vercel

1. Crear el repo en GitHub (ej. `JanikowNahuel/ecolun-web`) y pushear `main`.
2. En Vercel: **Add New → Project** → importar el repo. Framework Preset:
   **Next.js** (verificar que no quede en "Other").
3. Variable opcional `NEXT_PUBLIC_SITE_URL` con la URL final (ej.
   `https://ecolun.com.ar`). Sin ella usa `https://ecolun-web.vercel.app`.
