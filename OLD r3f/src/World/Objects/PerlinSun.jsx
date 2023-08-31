import * as THREE from "three"
import audio from "../../AudioAnalizer.jsx";
import PerlinSunVertex from "../../Shaders/PerlinSun/PerlinSunVertex.glsl"
import PerlinSunFragment from "../../Shaders/PerlinSun/PerlinSunFragment.glsl"
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";


export default function PerlinSun({meshRef = useRef(), debug = false}) { 
    
    const uniforms = useMemo(() => ({
        uAudioTexture       : { value : audio.bufferCanvasLinear.texture },
        uAudioStrengthFreq  : { value : 1 },
        uAudioStrengthSin   : { value : 1 },
        uRadiusFreq         : { value : 0.4 },
        uRadiusSin          : { value : 0.25 },
        uTime               : { value : 0 },
//        uColorFrequency : { value : new THREE.Color("#ddf38c") },
//        uColorSin       : { value : new THREE.Color("#6060e6") },
        uNoiseStrength      : { value : 15 },
        uNoiseSpeed         : { value : 1 }
    }), [] );
    
    useFrame((state, delta) => {       
        uniforms.uTime.value += delta ;
    });


    return <mesh ref={ meshRef }
            position={ [ 20, 10, -45 ] }
            rotation-z={ -Math.PI * 0.5 }
        >
            <planeGeometry args={ [ 12, 12 ] } />
            <shaderMaterial 
                uniforms       = { uniforms }
//                side           = { THREE.DoubleSide }
                transparent    = { true }
                vertexShader   = { PerlinSunVertex }
                fragmentShader = { PerlinSunFragment }
            />

        </mesh>
        
}
