# Ecolun · Landing pública

Sitio informativo del consultorio (Dra. Luna, Av. Vélez Sarsfield 3347, Córdoba).
Proyecto **aparte** de `ecolun-nextjs` (la app de turnos): no comparte código ni
base de datos, así un cambio acá nunca rompe la agenda.

Next.js 16 (App Router, Turbopack) · TypeScript strict · Tailwind v4 ·
Framer Motion · React Three Fiber (three.js) · Lucide. Todo se genera
estático (`○` en el build).

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run verificar  # 27 chequeos de la lógica del escaneo
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
| `embarazo.ts` | Las 5 etapas del escaneo, cada una con su ecografía |
| `creditos-imagenes.ts` | Autor y licencia de cada ecografía (se muestran en el pie) |
| `navegacion.ts` | Links del menú |

### Pendiente de completar (buscar `TODO` en `consultorio.ts` y `estudios.ts`)

- [ ] Horarios de atención.
- [ ] Obras sociales / prepagas.
- [ ] (Opcional) Matrícula de la doctora.
- [ ] Revisar la lista de estudios con la doctora.
- [ ] Confirmar que hace ecografías 3D/4D (si no, borrar esa etapa en `embarazo.ts`).
- [ ] Reemplazar las ecografías de Wikimedia por ecos propias de la Dra. Luna (ver abajo).

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
| `ecos/*.jpg` | Ecografías reales de Wikimedia Commons, recortadas sin datos de pacientes |
| `transductor-quieto.png` | Foto fija del transductor 3D, mientras carga three.js |

**Para cambiar las ecografías por las de la doctora:** pedirle permiso a la
paciente, recortar para que no se vea nombre, DNI ni fecha, guardar en
`src/assets/ecos/` en formato 4:3 y cambiar el import en `embarazo.ts`. Ahí
también: `medida` tiene que coincidir con lo que muestra la imagen, `foco` es el
recuadro verde (x, y, ancho, alto en %) y `credito` se borra junto con su
entrada en `creditos-imagenes.ts` (las propias no necesitan crédito).

`src/app/icon.svg` (pestaña del navegador) y `src/app/apple-icon.png` (ícono
en el iPhone) salen del símbolo del logo. Para cambiar la foto, reemplazá
`doctora.jpg` por otra en formato vertical 4:5.

## Cómo está armado

```
src/
  app/            layout, página, robots, sitemap, imagen para compartir, ícono
  assets/         logo, foto, ecografías (ver arriba)
  content/        datos editables (ver arriba)
  components/
    embarazo/     la sección con scroll (textos + barra de etapas)
    escaner/      consola del ecógrafo: transductor 3D + monitor con el barrido
    hero/         hero y polaroid
    secciones/    estudios, doctora, opiniones, contacto
    layout/       header, cierre con casquete + pie, botón flotante
    ui/           piezas de la guía de marca (resaltado, píldora, arcos, botón…)
  hooks/          opacidad por etapa, reducir movimiento
  lib/            lógica pura (línea de tiempo y barrido, SEO, WhatsApp)
  fonts/          Poppins y Gochi Hand en el repo (no depende de Google Fonts)
scripts/
  verificar-logica.ts
```

**El escaneo.** `RecorridoEmbarazo` mide 5,2 pantallas de alto y su contenido
queda fijo (sticky). `useScroll` da un único progreso de 0 a 1, repartido en 5
etapas. En cada etapa, durante el primer 45 % de su tramo, el transductor 3D se
inclina de un lado al otro y el monitor revela la ecografía con una máscara
cónica que sale del vértice del abanico, siguiendo la línea de barrido; el resto
del tramo la imagen queda quieta con el recuadro de foco. Las etapas pares barren
hacia la derecha y las impares hacia la izquierda, así el transductor no salta.
Toda esa lógica es pura (`lib/embarazo/linea-de-tiempo.ts`) y la prueba
`npm run verificar`.

**El transductor 3D** (`components/escaner/transductor-3d.tsx`) está modelado en
código con three.js: no descarga modelos ni mapas de entorno. El haz es un
shader con ondas. three.js pesa ~270 KB comprimido, así que se descarga recién
cuando la sección está por entrar en pantalla, dibuja solo mientras se ve, y
hasta que está listo se muestra `transductor-quieto.png`. Si se cambia el modelo
o la cámara, regenerar esa foto para que coincida.

**Accesibilidad.** Con "reducir movimiento" activo la animación sigue, porque la
maneja el propio scroll (Windows con los efectos de animación apagados lo
activa solo); se apagan el resorte de suavizado, el balanceo del transductor,
las ondas del haz y el deslizamiento de los textos. El teal principal con texto
blanco da 3,6:1, por eso el texto chico va sobre `teal-profundo` y el resaltado
menta lleva texto oscuro en vez de blanco.

**Reseñas.** Con la lista vacía, la sección muestra solo la calificación y el
link a Google. No cargar reseñas inventadas ni editadas.

**SEO.** HTML renderizado en el servidor, datos estructurados `MedicalClinic`
(sin `aggregateRating`: Google no lo acepta para reseñas propias), imagen para
compartir por WhatsApp/Instagram, `robots.txt` y `sitemap.xml`.

## Deploy en Vercel

Repo: `JanikowNahuel/Ecolun-Landig`. Cada push a `main` despliega solo.
Framework Preset: **Next.js** (no "Other").

Variable opcional `NEXT_PUBLIC_SITE_URL` con la URL final (ej.
   `https://ecolun.com.ar`). Sin ella usa `https://ecolun-web.vercel.app`.
