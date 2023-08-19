import * as THREE from "three"
import audio from "../AudioAnalizer.jsx";
import PerlinSunVertex from "../Shaders/PerlinSun/PerlinSunVertex.glsl"
import PerlinSunFragment from "../Shaders/PerlinSun/PerlinSunFragment.glsl"
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react";


export default function PerlinSun({meshRef = useRef(), debug = false}) { 
    
    const uniforms = useMemo(() => ({
        uAudioTexture   : { value : audio.bufferCanvasLinear.texture },
        uTime           : { value : 0 },
        uColorFrequency : { value : new THREE.Color("#ddf38c") },
        uColorSin       : { value : new THREE.Color("#6060e6") },
        uNoiseStrength  : { value : 15 },
        uNoiseSpeed     : { value : 1 }
    }), [] );
    
    useFrame((state, delta) => {       
        uniforms.uTime.value += delta ;
    });


    return <mesh ref= { meshRef }
        position={ [ 20, 5, -15 ] }
        rotation-z={ -Math.PI * 0.5 }
    >
        <planeGeometry args={ [ 12, 12 ] } />
        <shaderMaterial 
            uniforms       = { uniforms }
            side           = { THREE.DoubleSide }
            transparent    = { true }
            vertexShader   = { PerlinSunVertex }
            fragmentShader = { PerlinSunFragment }
        />

    </mesh>
}
