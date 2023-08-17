import * as THREE from "three"
import audio from "../AudioAnalizer.jsx";
import SpiralVertex from "./Shaders/SpiralVertex.glsl"
import SpiralFragment from "./Shaders/SpiralFragment.glsl"
import { useControls } from "leva";
import { useFrame, useThree } from "@react-three/fiber"
import { useMemo } from "react";

export default function Spirals({spiralMesh}) {
//    const mesh = useRef(null);

    const spiralLeva = useControls("Spirals", {
            Strength        : { value : 0.4 , min : 0.1, max : 2, step : 0.01 },
            Zoom            : { value : 2   , min : 0.1, max : 2, step : 0.01 },
            StrengthSin     : { value : 1   , min : 0.1, max : 2, step : 0.01 },
            ZoomSin         : { value : 1   , min : 0.1, max : 2, step : 0.01},
            Frequency       : { value : 0.1 , min : 0.1, max : 1, step : 0.1 },
            Speed           : { value : 0.12, min : 0.1, max : 1, step : 0.01 },
            Thickness       : { value : 0.1 , min : 0.1, max : 0.75, step : 0.01 },
            FrequencySin    : { value : 0.5 , min : 0.1, max : 1, step : 0.1 },
            SpeedSin        : { value : 0.75, min : 0.1, max : 2, step : 0.01 },
            ThicknessSin    : { value : 0.01, min : 0.1, max : 0.75, step : 0.01}
        }
    );

    const uniforms = useMemo(() => ({
        uAudioTexture      : { value : audio.bufferCanvasLinear.texture },
        uAudioStrength     : { value : spiralLeva.Strength },
        uAudioZoom         : { value : spiralLeva.Zoom },
        uAudioStrengthSin  : { value : spiralLeva.StrengthSin },
        uAudioZoomSin      : { value : spiralLeva.ZoomSin },
        uTime              : { value : 0 },
        uFrequency         : { value : spiralLeva.Frequency },
        uSpeed             : { value : spiralLeva.Speed },
        uThickness         : { value : spiralLeva.Thickness },
        uFrequencySin      : { value : spiralLeva.FrequencySin },
        uSpeedSin          : { value : spiralLeva.SpeedSin },
        uThicknessSin      : { value : spiralLeva.ThicknessSin }
    }), [/*coneLeva.uAudioStrength, coneLeva.uAudioZoom, coneLeva.uAudioStrengthSin, coneLeva.uFrequency,
coneLeva.uSpeed, coneLeva.uThickness, coneLeva.uFrequencySin, coneLeva.uSpeedSin, coneLeva.uThicknessSin */] );
    
    useFrame((state, delta) => {       
        uniforms.uTime.value                = state.clock.elapsedTime;
        // update uniforms from leva values
        uniforms.uAudioStrength.value       = spiralLeva.Strength;
        uniforms.uAudioZoom.value           = spiralLeva.Zoom;
        uniforms.uAudioStrengthSin.value    = spiralLeva.StrengthSin;
        uniforms.uAudioZoomSin.value        = spiralLeva.ZoomSin;
        uniforms.uFrequency.value           = spiralLeva.Frequency;
        uniforms.uSpeed.value               = spiralLeva.Speed;
        uniforms.uThickness.value           = spiralLeva.Thickness;
        uniforms.uFrequencySin.value        = spiralLeva.FrequencySin;
        uniforms.uSpeedSin.value            = spiralLeva.SpeedSin;
        uniforms.uThicknessSin.value        = spiralLeva.ThicknessSin;
    });


    return <mesh ref={ spiralMesh } rotation-x={ -Math.PI * 0.5 } position-z={ -22 } >
        <cylinderGeometry args= { [ 0.01, 2, 64, 256, 1, true ] } />
        <shaderMaterial            
            uniforms       = { uniforms }
            side           = { THREE.DoubleSide }
            transparent    = { true }
            vertexShader   = { SpiralVertex }
            fragmentShader = { SpiralFragment }
        />
    </ mesh>;
}