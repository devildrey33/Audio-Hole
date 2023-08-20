import * as THREE from "three"
import audio from "../../AudioAnalizer.jsx";
import SpiralsVertex from "../../Shaders/Spirals/SpiralsVertex.glsl"
import SpiralsFragment from "../../Shaders/Spirals/SpiralsFragment.glsl"
import { useControls } from "leva";
import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react";

export default function Spirals({meshRef = useRef(), debug = false}) {
//    const mesh = useRef(null);


    const uniforms = useMemo(() => ({
        uAudioTexture      : { value : audio.bufferCanvasLinear.texture },
        uAudioStrength     : { value : 0.4 },
        uAudioZoom         : { value : 2.0 },
        uAudioStrengthSin  : { value : 1.0 },
        uAudioZoomSin      : { value : 1.0 },
        uTime              : { value : 0 },
        uFrequency         : { value : 0.1 },
        uSpeed             : { value : 0.12 },
        uThickness         : { value : 0.1 },
        uFrequencySin      : { value : 0.5 },
        uSpeedSin          : { value : 0.75 },
        uThicknessSin      : { value : 0.01 }
    }), [] );

    
    useFrame((state, delta) => {       
        uniforms.uTime.value += delta ;
        uniforms.uThicknessSin.value = 0.01 + ((audio.averageFrequency[2] / 255) * 0.05);
    });


    if (debug) {
        const spiralLeva = useControls("Spirals", {
                Strength        : { value : uniforms.uAudioStrength.value   , min : 0.1,  max : 2,    step : 0.01,
                                    onChange: (v) => { uniforms.uAudioStrength.value = v } },
                Zoom            : { value : uniforms.uAudioZoom.value       , min : 0.1,  max : 16,    step : 0.01,
                                    onChange: (v) => { uniforms.uAudioZoom.value = v } },
                StrengthSin     : { value : uniforms.uAudioStrengthSin.value, min : 0.1,  max : 2,    step : 0.01,
                                    onChange: (v) => { uniforms.uAudioStrengthSin.value = v } },
                ZoomSin         : { value : uniforms.uAudioZoomSin.value    , min : 0.1,  max : 16,    step : 0.01,
                                    onChange: (v) => { uniforms.uAudioZoomSin.value = v } },
                Frequency       : { value : uniforms.uFrequency.value       , min : 0.1,  max : 1,    step : 0.1,
                                    onChange: (v) => { uniforms.uFrequency.value = v } },
                Speed           : { value : uniforms.uSpeed.value           , min : 0.1,  max : 1,    step : 0.01,
                                    onChange: (v) => { uniforms.uSpeed.value = v } },
                Thickness       : { value : uniforms.uThickness.value       , min : 0.01, max : 0.75, step : 0.01,
                                    onChange: (v) => { uniforms.uThickness.value = v } },
                FrequencySin    : { value : uniforms.uFrequencySin.value    , min : 0.1,  max : 1,    step : 0.1,
                                    onChange: (v) => { uniforms.uFrequencySin.value = v } },
                SpeedSin        : { value : uniforms.uSpeedSin.value        , min : 0.1,  max : 2,    step : 0.01,
                                    onChange: (v) => { uniforms.uSpeedSin.value = v } },
/*                ThicknessSin    : { value : uniforms.uThicknessSin.value    , min : 0.01, max : 0.75, step : 0.01,
                                    onChange: (v) => { uniforms.uThicknessSin.value = v } }*/
            }
        );
    }


    return <mesh ref={ meshRef } rotation-x={ -Math.PI * 0.5 } position-z={ -22 }  >
        <cylinderGeometry args= { [ 0.01, 2, 64, 256, 1, true ] } />
        <shaderMaterial            
            uniforms       = { uniforms }
            side           = { THREE.DoubleSide }
            transparent    = { true }
            vertexShader   = { SpiralsVertex }
            fragmentShader = { SpiralsFragment }
        />
    </ mesh>;
}