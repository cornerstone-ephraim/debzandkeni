"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, OrthographicCamera } from "three";
import type { MotionValue } from "motion/react";
import { LondonBanks } from "./london-banks";
import { Block, Bridge } from "./bridge";
import { palette as p } from "./scene-palette";

function Traffic({ paused }: { paused: boolean }) {
  const fleet = useRef<Group>(null);
  useFrame((_, delta) => {
    if (paused || !fleet.current) return;
    fleet.current.children.forEach((car, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      car.position.x +=
        Math.min(delta, 0.05) * direction * (i % 3 === 0 ? 1.15 : 1.65);
      if (car.position.x > 90) car.position.x = -90;
      if (car.position.x < -90) car.position.x = 90;
    });
  });
  return (
    <group ref={fleet}>
      {Array.from({ length: 24 }, (_, i) => {
        const bus = i % 3 === 0;
        return (
          <group
            key={i}
            position={[-86 + i * 7.4, 1.85, i % 2 === 0 ? -0.43 : 0.43]}
            rotation={[0, i % 2 === 0 ? 0 : Math.PI, 0]}
          >
            <Block
              position={[0, bus ? 0.44 : 0.2, 0]}
              size={[bus ? 1.3 : 0.8, bus ? 0.85 : 0.32, 0.38]}
              color={bus ? p.bus : p.dark}
            />
            <Block
              position={[0, bus ? 0.63 : 0.39, 0]}
              size={[bus ? 1.13 : 0.43, 0.18, 0.39]}
              color={p.dark}
            />
            {bus && (
              <Block
                position={[0, 0.3, 0]}
                size={[1.13, 0.17, 0.39]}
                color={p.window}
              />
            )}
            <Block
              position={[0.43, 0.16, 0]}
              size={[0.04, 0.07, 0.3]}
              color={p.window}
            />
            {[-0.37, 0.37].map((x) => (
              <mesh
                key={x}
                position={[x, 0.06, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.1, 0.1, 0.45, 8]} />
                <meshStandardMaterial color={p.dark} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function World({
  progress,
  paused,
}: {
  progress: MotionValue<number>;
  paused: boolean;
}) {
  const boat = useRef<Group>(null);
  const cameraProgress = useRef(0);
  useFrame(({ camera, clock, size }, delta) => {
    if (!paused) {
      const blend = 1 - Math.exp(-8 * Math.min(delta, 0.05));
      cameraProgress.current +=
        (progress.get() - cameraProgress.current) * blend;
    }
    const t = cameraProgress.current;
    // A level side elevation: no horizontal yaw, roll, or perspective convergence.
    const focusX = -38 + t * 76;
    const lens = camera as OrthographicCamera;
    const zoom = size.height / 18;
    if (lens.zoom !== zoom) {
      lens.zoom = zoom;
      lens.updateProjectionMatrix();
    }
    camera.position.set(focusX, 8.5, 40);
    camera.lookAt(focusX, 5, 0);
    if (boat.current && !paused) {
      boat.current.position.x = Math.sin(clock.elapsedTime * 0.035) * 17;
      boat.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.025;
    }
  });
  return (
    <>
      <ambientLight intensity={0.65} color="#a9bfdc" />
      <directionalLight
        position={[-15, 25, 15]}
        intensity={0.9}
        color="#b7cff5"
      />
      <fog attach="fog" args={[p.sky, 48, 115]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial
          color={p.river}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      <LondonBanks />
      <Bridge />
      <Traffic paused={paused} />
      <group ref={boat} position={[0, 0, 8]}>
        <Block position={[0, 0.05, 0]} size={[2.6, 0.25, 0.8]} color={p.dark} />
        <Block position={[0, 0.35, 0]} size={[1.8, 0.4, 0.65]} color={p.trim} />
        <Block
          position={[0, 0.42, 0.33]}
          size={[1.5, 0.16, 0.02]}
          color={p.roof}
        />
      </group>
      {Array.from({ length: 24 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[((i * 13) % 47) - 23, -0.165, ((i * 7) % 23) - 3]}
        >
          <planeGeometry args={[0.6 + (i % 4), 0.035]} />
          <meshBasicMaterial color={p.trim} transparent opacity={0.3} />
        </mesh>
      ))}
    </>
  );
}

export default function LondonScene({
  progress,
  paused,
}: {
  progress: MotionValue<number>;
  paused: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      orthographic
      camera={{ position: [-38, 8.5, 40], zoom: 20, near: 0.1, far: 250 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={paused ? "demand" : "always"}
      fallback={<span />}
    >
      <World progress={progress} paused={paused} />
    </Canvas>
  );
}
