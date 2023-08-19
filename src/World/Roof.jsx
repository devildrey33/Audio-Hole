import * as THREE from "three"
import audio from "../AudioAnalizer.jsx";
import RoofVertex from "../Shaders/Roof/RoofVertex.glsl"
import RoofFragment from "../Shaders/Roof/RoofFragment.glsl"
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber"
import { useMemo, useReducer, useRef } from "react";

export default function Roof({meshRef = useRef(), debug = false}) {

    const uniforms = useMemo(() => ({
        uAudioTexture      : { value : audio.bufferCanvasSquare.texture },
        uAudioStrength     : { value : 5 },
    }), []);
    
    
    if (debug) {
        const roofLeva = useControls("Roof", {
            position : { x: 0, y: 16, z: -15, 
                         onChange: (v) => { meshRef.current.position.copy(v) }, },
            Strength : { value : uniforms.uAudioStrength.value , min : 0.1, max : 10, step : 0.01,
                         onChange : (v) => { uniforms.uAudioStrength.value = v; } },
        });
    }

    

//    useFrame((state, delta) => {       
//    });

    return <mesh ref= { meshRef }
        rotation-x= { -Math.PI * 0.5 } scale= { 3 } position= {[0, 16, -15]} >
        <planeGeometry args= { [ 32, 32, 32, 32 ] } />
        <shaderMaterial            
            uniforms       = { uniforms }
            side           = { THREE.DoubleSide }
            transparent    = { false }
            wireframe      = { true }
            vertexShader   = { RoofVertex }
            fragmentShader = { RoofFragment }
        />
    </mesh>
}