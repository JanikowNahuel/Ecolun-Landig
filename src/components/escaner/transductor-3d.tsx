"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Transductor convexo (el de las ecos de embarazo) modelado en código: no
 * descarga ningún modelo ni mapa de entorno. El vértice de la lente está en
 * el origen, así al inclinarlo la punta queda fija sobre el abanico.
 */

const BLANCO = "#f3f6f6";
const GOMA = "#27302f";
const TEAL = "#4f9197";
const MENTA = "#90c3a2";

/** Contorno del mango (radio, altura) para el torneado. */
const PERFIL_MANGO: Array<[number, number]> = [
  [0, 0.7],
  [0.55, 0.7],
  [0.53, 0.84],
  [0.44, 1.02],
  [0.37, 1.35],
  [0.36, 1.6],
  [0.385, 1.95],
  [0.36, 2.3],
  [0.3, 2.6],
  [0.22, 2.82],
  [0.15, 2.95],
  [0, 2.96],
];

function geometriaLente() {
  // Cara convexa: arco de radio 1,4 que asoma debajo del cabezal.
  const R = 1.4;
  const medio = Math.asin(0.6 / R);
  const forma = new THREE.Shape();
  forma.moveTo(-0.6, 0.32);
  forma.lineTo(0.6, 0.32);
  forma.lineTo(0.6, R - R * Math.cos(medio));
  forma.absarc(0, R, R, -Math.PI / 2 + medio, -Math.PI / 2 - medio, true);
  forma.lineTo(-0.6, 0.32);
  const g = new THREE.ExtrudeGeometry(forma, {
    depth: 0.44,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 3,
    curveSegments: 40,
  });
  g.translate(0, 0.025, -0.22);
  return g;
}

/**
 * Encuadre: la punta de la lente (y = 0) queda a `PUNTA_DESDE_ABAJO` del alto
 * del lienzo, medido desde abajo. El haz llega justo hasta el borde inferior,
 * donde el monitor sigue el abanico.
 */
export const CAMARA = { y: 1.45, mira: 1.45, distancia: 8.2, fov: 30 } as const;
const ALTO_VISIBLE = 2 * CAMARA.distancia * Math.tan(THREE.MathUtils.degToRad(CAMARA.fov / 2));
const BAJO_PUNTA = CAMARA.mira - ALTO_VISIBLE / 2; // y del borde inferior (negativo)
export const PUNTA_DESDE_ABAJO = -BAJO_PUNTA / ALTO_VISIBLE;

const VERTICE_HAZ = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FRAGMENTO_HAZ = /* glsl */ `
  uniform float uTiempo;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float desdePunta = 1.0 - vUv.y;               // 0 en la lente, 1 abajo
    float base = smoothstep(1.0, 0.0, desdePunta) * 0.38;
    float ondas = smoothstep(0.55, 1.0, sin(desdePunta * 34.0 - uTiempo * 7.0)) * 0.55;
    float alfa = (base + ondas * (1.0 - desdePunta)) * smoothstep(0.0, 0.04, desdePunta);
    gl_FragColor = vec4(uColor, alfa);
  }
`;

function Haz({ reducir }: { reducir: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const largo = -BAJO_PUNTA + 0.02;
  const geometria = useMemo(() => {
    const g = new THREE.ConeGeometry(largo * Math.tan(THREE.MathUtils.degToRad(38)), largo, 48, 1, true);
    g.translate(0, -largo / 2, 0);
    return g;
  }, [largo]);
  const uniforms = useMemo(() => ({ uTiempo: { value: 0 }, uColor: { value: new THREE.Color("#b0e4e5") } }), []);
  useFrame(({ clock }) => {
    if (material.current && !reducir) material.current.uniforms.uTiempo.value = clock.getElapsedTime();
  });
  return (
    <mesh geometry={geometria} scale={[1, 1, 0.06]}>
      <shaderMaterial
        ref={material}
        vertexShader={VERTICE_HAZ}
        fragmentShader={FRAGMENTO_HAZ}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Modelo({ inclinacion, giro, reducir }: Props) {
  const grupo = useRef<THREE.Group>(null);
  const cuerpo = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);

  const mango = useMemo(
    () =>
      new THREE.LatheGeometry(
        PERFIL_MANGO.map(([r, y]) => new THREE.Vector2(r, y)),
        64,
      ),
    [],
  );
  const lente = useMemo(() => geometriaLente(), []);
  const cable = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.2, 0),
      new THREE.Vector3(0.05, 3.8, 0.05),
      new THREE.Vector3(0.45, 4.45, -0.15),
      new THREE.Vector3(1.3, 4.95, -0.5),
      new THREE.Vector3(2.4, 5.2, -0.9),
    ]);
    return new THREE.TubeGeometry(curva, 80, 0.07, 16, false);
  }, []);

  useFrame(({ clock }) => {
    const g = grupo.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const flotar = reducir ? 0 : Math.sin(t * 1.4) * 0.025;
    // suavizado propio: sigue al scroll sin saltos
    const objetivoZ = THREE.MathUtils.degToRad(inclinacion.get());
    const objetivoY = -0.55 + giro.get();
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, objetivoZ, reducir ? 1 : 0.18);
    if (cuerpo.current) {
      cuerpo.current.rotation.y = THREE.MathUtils.lerp(cuerpo.current.rotation.y, objetivoY, reducir ? 1 : 0.12);
      cuerpo.current.position.y = flotar;
    }
    if (led.current) led.current.emissiveIntensity = reducir ? 1.4 : 1.1 + Math.sin(t * 3) * 0.5;
  });

  return (
    <group ref={grupo} rotation={[0, 0, 0]}>
      <Haz reducir={reducir} />
      <group ref={cuerpo} rotation={[0.12, -0.55, 0]}>
        {/* lente */}
        <mesh geometry={lente} castShadow>
          <meshStandardMaterial color={GOMA} roughness={0.85} metalness={0} />
        </mesh>
        {/* cabezal */}
        <RoundedBox args={[1.34, 0.6, 0.64]} radius={0.16} smoothness={5} position={[0, 0.56, 0]}>
          <meshPhysicalMaterial color={BLANCO} roughness={0.32} clearcoat={1} clearcoatRoughness={0.15} />
        </RoundedBox>
        {/* línea teal del cabezal */}
        <mesh position={[0, 0.33, 0]}>
          <boxGeometry args={[1.3, 0.035, 0.625]} />
          <meshStandardMaterial color={TEAL} roughness={0.4} metalness={0.3} />
        </mesh>
        {/* mango achatado */}
        <mesh geometry={mango} scale={[1.14, 1, 0.56]}>
          <meshPhysicalMaterial color={BLANCO} roughness={0.3} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
        {/* anillo de agarre */}
        <mesh position={[0, 1.03, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.14, 0.56, 1]}>
          <torusGeometry args={[0.44, 0.028, 16, 64]} />
          <meshStandardMaterial color={TEAL} roughness={0.35} metalness={0.4} />
        </mesh>
        {/* indicador encendido */}
        <mesh position={[0, 1.75, 0.212]}>
          <sphereGeometry args={[0.035, 20, 20]} />
          <meshStandardMaterial ref={led} color={MENTA} emissive={MENTA} emissiveIntensity={1.2} />
        </mesh>
        {/* protector del cable */}
        <mesh position={[0, 3.08, 0]}>
          <cylinderGeometry args={[0.09, 0.15, 0.32, 32]} />
          <meshStandardMaterial color={GOMA} roughness={0.7} />
        </mesh>
        <mesh geometry={cable}>
          <meshStandardMaterial color="#33403f" roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

type Props = {
  /** Grados; positivo = el haz apunta a la derecha. */
  inclinacion: MotionValue<number>;
  /** Radianes extra de giro sobre su eje, para que se vea en volumen. */
  giro: MotionValue<number>;
  reducir: boolean;
};

export default function Transductor3D({
  activo,
  alEstarListo,
  ...props
}: Props & { activo: boolean; alEstarListo?: () => void }) {
  return (
    <Canvas
      frameloop={activo ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, CAMARA.y, CAMARA.distancia], fov: CAMARA.fov, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ camera }) => {
        camera.lookAt(0, CAMARA.mira, 0);
        // dos cuadros después ya hay imagen: recién ahí se oculta la foto fija
        requestAnimationFrame(() => requestAnimationFrame(() => alEstarListo?.()));
      }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color={MENTA} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 3]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-4, 1, 2]} rotation-y={Math.PI / 3} scale={[3, 5, 1]} />
        <Lightformer
          form="rect"
          intensity={1.4}
          color={MENTA}
          position={[4, 1.5, -1]}
          rotation-y={-Math.PI / 2.5}
          scale={[2, 5, 1]}
        />
      </Environment>
      <Modelo {...props} />
    </Canvas>
  );
}
