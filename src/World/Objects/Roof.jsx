import * as THREE from "three"
import audio from "../../AudioAnalizer.jsx";
import RoofVertex from "../../Shaders/Roof/RoofVertex.glsl"
import RoofFragment from "../../Shaders/Roof/RoofFragment.glsl"
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber"
import { useMemo, useReducer, useRef } from "react";

export default function Roof({meshRef = useRef(), debug = false}) {

    const uniforms = useMemo(() => ({
        uAudioTexture      : { value : audio.bufferCanvasSquare.texture },
        uAudioStrength     : { value : 20 },
    }), []);
    
    
    if (debug) {
        const roofLeva = useControls("Roof", {
            position : { x: 0, y: 32, z: -65, 
                         onChange: (v) => { meshRef.current.position.copy(v) }, },
            Strength : { value : uniforms.uAudioStrength.value , min : 0.1, max : 50, step : 0.01,
                         onChange : (v) => { uniforms.uAudioStrength.value = v; } },
        });
    }

    

//    useFrame((state, delta) => {       
//    });

    return <mesh ref= { meshRef }
        rotation-x= { -Math.PI * 0.5 } scale= { 3 } position= {[0, 32, -65]} >
        <planeGeometry args= { [ 64, 32, 32, 32 ] } />
        <shaderMaterial            
            uniforms       = { uniforms }
            side           = { THREE.DoubleSide }
            transparent    = { false }
/*            wireframe      = { true }*/
            vertexShader   = { RoofVertex }
            fragmentShader = { RoofFragment }
        />
    </mesh>
}