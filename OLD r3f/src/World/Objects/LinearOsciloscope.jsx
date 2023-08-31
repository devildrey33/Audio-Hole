import * as THREE from "three"
import audio from "../../AudioAnalizer.jsx";
import LinearOsciloscopeVertex from "../../Shaders/LinearOsciloscope/LinearOsciloscopeVertex.glsl"
import LinearOsciloscopeFragment from "../../Shaders/LinearOsciloscope/LinearOsciloscopeFragment.glsl"
import { useMemo, useRef } from "react";


export default function LinearOsciloscope({meshRef = useRef(), debug = false}) { 

    const uniforms = useMemo(() => ({
        uAudioTexture   : { value : audio.bufferCanvasLinear.texture },
        uAudioStrength  : { value : 1 },
        uAudioZoom      : { value : 1 },
        uThickness      : { value : 0.05 }
    }), [] );

    return <mesh 
        ref      = { meshRef }
        position = { [ 0, 32, -65 ] }
    >
        <planeGeometry args= { [ 10, 5 ] } />
        <shaderMaterial            
            uniforms       = { uniforms }
            side           = { THREE.DoubleSide }
            transparent    = { true }
            vertexShader   = { LinearOsciloscopeVertex }
            fragmentShader = { LinearOsciloscopeFragment }
        />
    </mesh>
}