import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HealthGlobeProps {
  score: number;
}

function AnimatedGlobe({ score }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = score > 70 ? '#22c55e' : score > 40 ? '#f59e0b' : '#ef4444';
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      const phi = Math.acos(-1 + (2 * i) / 100);
      const theta = Math.sqrt(100 * Math.PI) * phi;
      arr.push({
        position: [
          1.5 * Math.cos(theta) * Math.sin(phi),
          1.5 * Math.sin(theta) * Math.sin(phi),
          1.5 * Math.cos(phi),
        ] as [number, number, number],
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>
      
      {/* Inner Glow */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* Orbiting Particles */}
      {particles.slice(0, Math.floor(score / 2)).map((p, i) => (
        <Sphere key={i} args={[0.03, 8, 8]} position={p.position}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
        </Sphere>
      ))}
    </group>
  );
}

export function HealthGlobe({ score }: HealthGlobeProps) {
  return (
    <div className="w-full h-full min-h-[200px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <AnimatedGlobe score={score} />
      </Canvas>
    </div>
  );
}
