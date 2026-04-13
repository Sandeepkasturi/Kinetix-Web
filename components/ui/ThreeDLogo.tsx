"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

function Crystal(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = Math.cos(t / 4) / 2;
        meshRef.current.rotation.y = Math.sin(t / 4) / 2;
        meshRef.current.rotation.z = Math.sin(t / 1.5) / 2;
        meshRef.current.position.y = Math.sin(t / 1.5) / 10;
    });

    useFrame((state) => {
        if (!coreRef.current) return;
        const t = state.clock.getElapsedTime();
        coreRef.current.rotation.y += 0.05;
        coreRef.current.scale.setScalar(0.5 + Math.sin(t * 3) * 0.05); // Pulse
    })

    return (
        <group {...props}>
            {/* Outer Crystal Shell */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 0]} />
                {/* Debug Material */}
                <meshStandardMaterial color="hotpink" wireframe />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh ref={coreRef} scale={[0.5, 0.5, 0.5]}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshBasicMaterial color="#e879f9" toneMapped={false} />
            </mesh>
        </group>
    );
}

function ThreeDLogo({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Crystal />
                <Environment preset="city" />
                {/* Additional Lights for reflections */}
                <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
                <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
            </Canvas>
        </div>
    );
}

export default ThreeDLogo;
