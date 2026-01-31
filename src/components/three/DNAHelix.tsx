import { useRef, useMemo, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const HelixStrand = forwardRef<THREE.Group>(function HelixStrand(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  
  const { spheres, connections } = useMemo(() => {
    const sphereData: { position: [number, number, number]; color: string }[] = [];
    const connectionData: { start: [number, number, number]; end: [number, number, number] }[] = [];
    
    const turns = 3;
    const spheresPerTurn = 12;
    const totalSpheres = turns * spheresPerTurn;
    const height = 6;
    const radius = 1.2;
    
    for (let i = 0; i < totalSpheres; i++) {
      const t = i / totalSpheres;
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;
      
      // First strand
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      sphereData.push({ position: [x1, y, z1], color: '#22c55e' });
      
      // Second strand (opposite)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      sphereData.push({ position: [x2, y, z2], color: '#10b981' });
      
      // Connection between strands (every other pair)
      if (i % 2 === 0) {
        connectionData.push({
          start: [x1, y, z1],
          end: [x2, y, z2],
        });
      }
    }
    
    return { spheres: sphereData, connections: connectionData };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <Sphere key={i} args={[0.12, 16, 16]} position={sphere.position}>
          <meshStandardMaterial
            color={sphere.color}
            emissive={sphere.color}
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.4}
          />
        </Sphere>
      ))}
      {connections.map((conn, i) => (
        <line key={`conn-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([...conn.start, ...conn.end]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#22c55e" transparent opacity={0.4} />
        </line>
      ))}
    </group>
  );
});

const FloatingParticles = forwardRef<THREE.Group>(function FloatingParticles(_, ref) {
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
        ] as [number, number, number],
        scale: Math.random() * 0.08 + 0.02,
        speed: Math.random() * 0.5 + 0.5,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={ref}>
      {particles.map((particle, i) => (
        <Float
          key={i}
          speed={particle.speed}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <Sphere args={[particle.scale, 8, 8]} position={particle.position}>
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
});

export function DNAHelix() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22c55e" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
          <HelixStrand />
        </Float>
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
