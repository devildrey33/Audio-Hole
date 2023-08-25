
import { Bloom, ChromaticAberration, GodRays, EffectComposer } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useRef, useMemo } from 'react';
import options from '../Config/Options';
import { useControls } from 'leva';
import * as THREE from "three"


export default function Postprocessing ({ sunRef }) {  
    // Default values
    let { chromaOffset, chromaEnabled, bloomThreshold, bloomSmoothing, bloomHeight, bloomEnabled, godRayEnabled } = useMemo(() => ({
        chromaOffset    : new THREE.Vector2(0.001, 0.001),
        chromaEnabled   : true,
        bloomThreshold  : 0.9,
        bloomSmoothing  : 0.1,
        bloomHeight     : 10,
        bloomEnabled    : true,
        godRayEnabled   : true
    }), []);
    
    // Leva debug controls
    if (options.debug) {
        useControls('Chromatic Aberration', {
            x: { value : chromaOffset.x, min : -0.05, max : 0.05, step : 0.001, onChange : (v) => { chromaOffset.x = v } },
            y: { value : chromaOffset.y, min : -0.05, max : 0.05, step : 0.001, onChange : (v) => { chromaOffset.y = v } }           
        })

        useControls('Bloom', {
            threshold: { value : bloomThreshold, min : -10, max : 10,  step : 0.001, onChange : (v) => { bloomThreshold = v } },
            smoothing: { value : bloomSmoothing, min : -10, max : 10,  step : 0.001, onChange : (v) => { bloomSmoothing = v } },
            height   : { value : bloomHeight   , min :   0, max : 300, step : 0.001, onChange : (v) => { bloomHeight = v } },
        });
    }

    if (chromaEnabled === false && bloomEnabled === false) return <></>;

    return <EffectComposer>
        { /* Postprocessing */ }
        { chromaEnabled && (
            <ChromaticAberration offset={ chromaOffset } />
        )}
        { bloomEnabled && (
            <Bloom 
                luminanceThreshold={bloomThreshold} 
                luminanceSmoothing={bloomSmoothing} 
                intensity={bloomHeight}
                mipmapBlur={true}
                
            /> 
        )}
        { (sunRef.current && godRayEnabled) && (
            <GodRays
                sun={sunRef}
                blendFunction={BlendFunction.Screen} // The blend function of this effect.
                samples={30} // The number of samples per pixel.
                density={0.96} // The density of the light rays.
                decay={0.9} // An illumination decay factor.
                weight={0.4} // A light ray weight factor.
                exposure={0.6} // A constant attenuation coefficient.
                clampMax={1} // An upper bound for the saturation of the overall effect.
                blur={true} // Whether the god rays should be blurred to reduce artifacts.
            />
            
        )}

    </ EffectComposer>;
}
