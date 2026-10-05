import { puntosEnCurva } from "@/lib/embarazo/abanico";

/**
 * Figuras del bebé en coordenadas locales (0,0 = centro del cuerpo), en
 * corte de perfil: cabeza a la izquierda, cara hacia arriba, columna abajo.
 * Se dibujan como en una eco real: tejido gris claro, hueso blanco brillante
 * y líquido negro. Los gradientes y filtros los define <DefinicionesEco/>.
 */

export const COLOR = {
  hueso: "#f2fffd",
  tejido: "#9cc4c0",
  liquido: "#061213",
  caliper: "#90c3a2",
} as const;

type Punto = { x: number; y: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

export function DefinicionesEco({ prefijo }: { prefijo: string }) {
  return (
    <defs>
      {/* userSpaceOnUse: cabeza, cuerpo y miembros comparten una sola luz y se leen como una pieza */}
      <radialGradient id={`${prefijo}-tejido`} gradientUnits="userSpaceOnUse" cx={-14} cy={-34} r={150}>
        <stop offset="0%" stopColor="#c9e5e1" />
        <stop offset="55%" stopColor="#93bbb7" />
        <stop offset="100%" stopColor="#628c89" />
      </radialGradient>
      <radialGradient id={`${prefijo}-miembro`} gradientUnits="userSpaceOnUse" cx={-14} cy={-40} r={130}>
        <stop offset="0%" stopColor="#d6ece9" />
        <stop offset="100%" stopColor="#9cc4c0" />
      </radialGradient>
      <radialGradient id={`${prefijo}-cerebro`} cx="50%" cy="55%" r="60%">
        <stop offset="0%" stopColor="#6b9591" />
        <stop offset="100%" stopColor="#8fb7b3" />
      </radialGradient>
      <radialGradient id={`${prefijo}-fondo`} cx="50%" cy="6%" r="95%">
        <stop offset="0%" stopColor="#3a5d5e" />
        <stop offset="45%" stopColor="#24413f" />
        <stop offset="100%" stopColor="#0c1d1e" />
      </radialGradient>
      <filter id={`${prefijo}-suave`} x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur stdDeviation="1.3" />
      </filter>
      <filter id={`${prefijo}-brillo`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/** Elipse que une dos puntos: un segmento de brazo o pierna. */
function Segmento({ desde, hasta, grosor, fill }: { desde: Punto; hasta: Punto; grosor: number; fill: string }) {
  const cx = r2((desde.x + hasta.x) / 2);
  const cy = r2((desde.y + hasta.y) / 2);
  const largo = Math.hypot(hasta.x - desde.x, hasta.y - desde.y);
  const angulo = r2((Math.atan2(hasta.y - desde.y, hasta.x - desde.x) * 180) / Math.PI);
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={r2(largo / 2 + grosor * 0.35)}
      ry={grosor / 2}
      transform={`rotate(${angulo} ${cx} ${cy})`}
      fill={fill}
    />
  );
}

/**
 * Perfil de la cara (frente → nariz → labios → mentón) apoyado sobre la
 * cabeza. Los puntos van en ángulo y radio relativos al centro del cráneo.
 */
function caminoPerfil(centro: Punto, radio: number): string {
  const p = (grados: number, factor: number) => {
    const rad = (grados * Math.PI) / 180;
    return `${r2(centro.x + radio * factor * Math.cos(rad))} ${r2(centro.y + radio * factor * Math.sin(rad))}`;
  };
  return [
    `M ${p(-160, 0.96)}`,
    `Q ${p(-135, 1.1)} ${p(-118, 1.3)}`, // frente hasta la punta de la nariz
    `Q ${p(-110, 1.12)} ${p(-104, 1.08)}`, // base de la nariz
    `Q ${p(-97, 1.18)} ${p(-90, 1.1)}`, // labio superior
    `Q ${p(-83, 1.16)} ${p(-76, 1.1)}`, // labio inferior
    `Q ${p(-66, 1.2)} ${p(-56, 1.08)}`, // mentón
    `Q ${p(-45, 1.0)} ${p(-38, 0.92)}`, // cuello
    `L ${p(-90, 0.4)} Z`,
  ].join(" ");
}

/** Cruz de caliper ("+") como en la pantalla del ecógrafo. */
function Caliper({ x, y }: Punto) {
  return (
    <g stroke={COLOR.caliper} strokeWidth={1.6} strokeLinecap="round">
      <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
      <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
    </g>
  );
}

export function Medicion({ desde, hasta }: { desde: Punto; hasta: Punto }) {
  return (
    <g>
      <line
        x1={desde.x}
        y1={desde.y}
        x2={hasta.x}
        y2={hasta.y}
        stroke={COLOR.caliper}
        strokeWidth={1}
        strokeDasharray="2 3"
        opacity={0.9}
      />
      <Caliper {...desde} />
      <Caliper {...hasta} />
    </g>
  );
}

/** Semana ~7: embrión curvado, saco vitelino al lado y el latido. */
export function Embrion({ prefijo }: { prefijo: string }) {
  return (
    <g>
      <g filter={`url(#${prefijo}-suave)`}>
        <path
          d="M -9 -4 C 0 -13 15 -8 14 5"
          fill="none"
          stroke={`url(#${prefijo}-tejido)`}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle cx={-12} cy={4} r={8} fill={`url(#${prefijo}-tejido)`} />
        <circle cx={25} cy={-14} r={6.5} fill="none" stroke={COLOR.hueso} strokeWidth={1.8} opacity={0.85} />
      </g>
      <circle
        cx={1}
        cy={-5}
        r={2.4}
        fill={COLOR.hueso}
        className="origin-center animate-latido [transform-box:fill-box] motion-reduce:animate-none"
      />
    </g>
  );
}

type Proporciones = {
  cabeza: Punto & { r: number };
  torso: { cx: number; cy: number; rx: number; ry: number };
  hombro: Punto;
  codo: Punto;
  mano: Punto;
  cadera: Punto;
  rodilla: Punto;
  tobillo: Punto;
  grosorPierna: number;
  grosorBrazo: number;
  columna: [Punto, Punto, Punto];
  vertebras: number;
};

/** Arco del cráneo: abierto del lado de la cara, como se ve en un corte de perfil. */
function caminoCraneo(c: Punto, radio: number): string {
  const p = (grados: number) => {
    const rad = (grados * Math.PI) / 180;
    return `${r2(c.x + radio * Math.cos(rad))} ${r2(c.y + radio * Math.sin(rad))}`;
  };
  return `M ${p(62)} A ${radio} ${radio} 0 1 1 ${p(-128)}`;
}

/** Cuerpo genérico del bebé: lo comparten el de 12 semanas y el de 20+. */
function Cuerpo({ prefijo, f }: { prefijo: string; f: Proporciones }) {
  const tejido = `url(#${prefijo}-tejido)`;
  const miembro = `url(#${prefijo}-miembro)`;
  const vertebras = puntosEnCurva(f.columna[0], f.columna[1], f.columna[2], f.vertebras);
  return (
    <>
      <g filter={`url(#${prefijo}-suave)`}>
        <ellipse
          cx={f.torso.cx}
          cy={f.torso.cy}
          rx={f.torso.rx}
          ry={f.torso.ry}
          transform={`rotate(-5 ${f.torso.cx} ${f.torso.cy})`}
          fill={tejido}
        />
        {/* pierna plegada contra la panza */}
        <Segmento desde={f.cadera} hasta={f.rodilla} grosor={f.grosorPierna} fill={miembro} />
        <Segmento desde={f.rodilla} hasta={f.tobillo} grosor={f.grosorPierna * 0.74} fill={miembro} />
        <ellipse
          cx={f.tobillo.x + f.grosorPierna * 0.4}
          cy={f.tobillo.y + 1}
          rx={f.grosorPierna * 0.55}
          ry={f.grosorPierna * 0.3}
          fill={miembro}
        />
        <circle cx={f.cabeza.x} cy={f.cabeza.y} r={f.cabeza.r} fill={tejido} />
        <circle cx={f.cabeza.x} cy={f.cabeza.y} r={f.cabeza.r * 0.8} fill={`url(#${prefijo}-cerebro)`} />
        <path d={caminoPerfil(f.cabeza, f.cabeza.r)} fill={tejido} />
        {/* brazo doblado frente al pecho, la mano cerca del mentón */}
        <Segmento desde={f.hombro} hasta={f.codo} grosor={f.grosorBrazo} fill={miembro} />
        <Segmento desde={f.codo} hasta={f.mano} grosor={f.grosorBrazo * 0.82} fill={miembro} />
        <circle cx={f.mano.x} cy={f.mano.y} r={f.grosorBrazo * 0.55} fill={miembro} />
      </g>
      {/* hueso: cráneo y columna */}
      <path
        d={caminoCraneo(f.cabeza, f.cabeza.r - 1)}
        fill="none"
        stroke={COLOR.hueso}
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.88}
      />
      {vertebras.map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r={2.3} fill={COLOR.hueso} opacity={0.92} />
      ))}
    </>
  );
}

const PROPORCIONES_12: Proporciones = {
  cabeza: { x: -48, y: -2, r: 33 },
  torso: { cx: 18, cy: 4, rx: 49, ry: 26 },
  hombro: { x: -18, y: -10 },
  codo: { x: -6, y: -22 },
  mano: { x: -24, y: -27 },
  cadera: { x: 48, y: -4 },
  rodilla: { x: 26, y: -28 },
  tobillo: { x: 52, y: -34 },
  grosorPierna: 16,
  grosorBrazo: 10,
  columna: [
    { x: -17, y: 23 },
    { x: 22, y: 36 },
    { x: 62, y: 17 },
  ],
  vertebras: 11,
};

const PROPORCIONES_22: Proporciones = {
  cabeza: { x: -72, y: -4, r: 30 },
  torso: { cx: 14, cy: 2, rx: 68, ry: 33 },
  hombro: { x: -36, y: -12 },
  codo: { x: -20, y: -29 },
  mano: { x: -44, y: -32 },
  cadera: { x: 58, y: -6 },
  rodilla: { x: 28, y: -40 },
  tobillo: { x: 64, y: -48 },
  grosorPierna: 21,
  grosorBrazo: 13,
  columna: [
    { x: -42, y: 30 },
    { x: 18, y: 44 },
    { x: 80, y: 22 },
  ],
  vertebras: 16,
};

/** Semana ~12: corte de perfil de la translucencia nucal. */
export function FetoTemprano({ prefijo }: { prefijo: string }) {
  return (
    <g>
      <Cuerpo prefijo={prefijo} f={PROPORCIONES_12} />
      {/* hueso nasal */}
      <line x1={-63} y1={-31} x2={-58} y2={-36} stroke={COLOR.hueso} strokeWidth={1.8} strokeLinecap="round" />
      {/* translucencia nucal: espacio oscuro en la nuca, entre dos líneas brillantes */}
      <path d="M -33 22 Q -24 30 -12 26" fill="none" stroke={COLOR.liquido} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M -33 19 Q -24 27 -12 23" fill="none" stroke={COLOR.hueso} strokeWidth={1} opacity={0.8} />
      <path d="M -33 25.5 Q -24 33.5 -12 29.5" fill="none" stroke={COLOR.hueso} strokeWidth={1} opacity={0.8} />
    </g>
  );
}

/** Semanas 20–32: más proporcionado, con corazón, estómago, costillas y cordón. */
export function FetoAvanzado({ prefijo }: { prefijo: string }) {
  return (
    <g>
      {/* cordón umbilical hacia la placenta */}
      <path
        d={CAMINO_CORDON}
        fill="none"
        stroke={COLOR.tejido}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.65}
        filter={`url(#${prefijo}-suave)`}
      />
      <Cuerpo prefijo={prefijo} f={PROPORCIONES_22} />
      {[-24, -12, 0, 12].map((x) => (
        <path
          key={x}
          d={`M ${x} 32 Q ${x - 7} 10 ${x + 3} -14`}
          fill="none"
          stroke={COLOR.hueso}
          strokeWidth={1.4}
          opacity={0.35}
        />
      ))}
      {/* líquido: estómago y corazón de cuatro cámaras */}
      <ellipse cx={32} cy={-2} rx={8} ry={6} fill={COLOR.liquido} opacity={0.85} />
      <g className="origin-center animate-latido [transform-box:fill-box] motion-reduce:animate-none">
        <ellipse cx={-12} cy={6} rx={6.5} ry={6} fill={COLOR.liquido} opacity={0.8} />
        <path d="M -12 1 V 11" stroke={COLOR.hueso} strokeWidth={1.1} opacity={0.5} />
      </g>
    </g>
  );
}

export const CAMINO_CORDON = "M 24 -26 C 36 -54 8 -70 24 -92 S 36 -108 30 -116";
