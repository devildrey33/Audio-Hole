
import { Bloom, ChromaticAberration, GodRays, EffectComposer, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useRef, useMemo, useState } from 'react';
import options from '../Config/Options';
import { useControls } from 'leva';
import * as THREE from "three"
import { useFrame } from '@react-three/fiber';
import audio from '../AudioAnalizer';


export default function Postprocessing ({ sunRef }) {  
    const values = useMemo(() => ({
        chromaEnabled   : false,
        chromaOffset    : new THREE.Vector2(0.001, 0.001),
        bloomEnabled    : true,
        bloomThreshold  : -15.4,
        bloomSmoothing  : -5.32,
        bloomIntensity  : 5,
        godRaysEnabled  : true,
        godRaysSamples  : 30,
        godRaysDensity  : 0.96,
        godRaysDecay    : 0.9,
        godRaysWeight   : 0.4,
        godRaysExposure : 0.6,
        godRaysClampMax : 1,
        godRaysBlur     : true
    }), [] );

    // Default values
/*    const [chromaOffset, setChromaOffset]       = useState(new THREE.Vector2(0.001, 0.001));
    const [chromaEnabled, setChromaEnabled]     = useState(false);
    const [bloomThreshold, setBloomThreshold]   = useState(-15.4);
    const [bloomSmoothing, setBloomSmoothing]   = useState(-5.32);
    const [bloomIntensity, setBloomIntensity]   = useState(5);
    const [bloomEnabled, setBloomEnabled]       = useState(true);
    const [godRaysEnabled, setGodRaysEnabled]   = useState(true);
    const [godRaysSamples, setGodRaysSamples]   = useState(30);
    const [godRaysDensity, setGodRaysDensity]   = useState(0.96);
    const [godRaysDecay, setGodRaysDecay]       = useState(0.9);
    const [godRaysWeight, setGodRaysWeight]     = useState(0.4);
    const [godRaysExposure, setGodRaysExposure] = useState(0.6);
    const [godRaysClampMax, setGodRaysClampMax] = useState(1);
    const [godRaysBlur, setGodRaysBlur]         = useState(true);*/


    
    // Leva debug controls
    if (options.debug) {
        useControls('Bloom', {
            enabled   : { value : values.bloomEnabled, onChange : (v) => { values.bloomEnabled = v } },
            threshold : { value : values.bloomThreshold, min : -20, max : 20,  step : 0.01, onChange : (v) => { values.bloomThreshold = v } },
            smoothing : { value : values.bloomSmoothing, min : -20, max : 20,  step : 0.01, onChange : (v) => { values.bloomSmoothing = v } },
            intensity : { value : values.bloomIntensity, min :   0, max : 50, step : 0.01, onChange : (v) => { values.bloomIntensity =v } },
        });

        useControls('God Rays', {
            enabled  : { value : values.godRaysEnabled, onChange : (v) => { values.godRaysEnabled = v } },
            samples  : { value : values.godRaysSamples, min : 1, max : 300,  step : 1, onChange : (v) => { values.godRaysSamples = v } },
            density  : { value : values.godRaysDensity, min : 0.1, max : 10,  step : 0.1, onChange : (v) => { values.godRaysDensity = v } },
            decay    : { value : values.godRaysDecay, min : -1, max : 1,  step : 0.01, onChange : (v) => { values.godRaysDecay = v } },
            weight   : { value : values.godRaysWeight, min : 0, max : 10,  step : 0.1, onChange : (v) => { values.godRaysWeight = v  } },
            exposure : { value : values.godRaysExposure, min : 0, max : 10,  step : 0.1, onChange : (v) => { values.godRaysExposure = v } },
            clampMax : { value : values.godRaysClampMax, min : -10, max : 10,  step : 0.1, onChange : (v) => { values.godRaysClampMax = v } },
            blur     : { value : values.godRaysBlur, min : -10, max : 10,  step : 0.1, onChange : (v) => { values.godRaysBlur = v } },
        })

        useControls('Chromatic Aberration', {
            enabled : { value : values.chromaEnabled, onChange : (v) => { values.chromaEnabled = v } },
            x       : { value : values.chromaOffset.x, min : -0.05, max : 0.05, step : 0.01, onChange : (v) => { values.chromaOffset.x = v } },
            y       : { value : values.chromaOffset.y, min : -0.05, max : 0.05, step : 0.01, onChange : (v) => { values.chromaOffset.y = v } }           
        })

    }

    useFrame((state, delta) => {       
        values.bloomIntensity = 0.2 + (audio.averageFrequency[2] / 255);

        values.bloomSmoothing = -1.5 + ((Math.sin(state.clock.oldTime / 10000) * 5.5));
        values.bloomThreshold = 1.5 + ((Math.cos(state.clock.oldTime / 10000) * 5.5));

        console.log(values.bloomIntensity, values.bloomThreshold, values.bloomSmoothing)
    });

    // Effects are all disabled, return an empty component
    if (values.chromaEnabled === false && values.bloomEnabled === false && values.godRaysEnabled === false) 
        return <></>;

    // One or more effects enabled
    return <EffectComposer>

        

        { /* Postprocessing */ }
        { values.chromaEnabled && (
            <ChromaticAberration offset={ values.chromaOffset } />
        )}
        { (sunRef.current && values.godRaysEnabled) && (
            <GodRays
                sun           ={ sunRef }
                blendFunction ={ BlendFunction.Screen } // The blend function of this effect.
                samples       ={ values.godRaysSamples }       // The number of samples per pixel.
                density       ={ values.godRaysDensity}        // The density of the light rays.
                decay         ={ values.godRaysDecay }         // An illumination decay factor.
                weight        ={ values.godRaysWeight }        // A light ray weight factor.
                exposure      ={ values.godRaysExposure }      // A constant attenuation coefficient.
                clampMax      ={ values.godRaysClampMax }      // An upper bound for the saturation of the overall effect.
                blur          ={ values.godRaysBlur }          // Whether the god rays should be blurred to reduce artifacts.
            />
            
        )}
        { values.bloomEnabled && (
            <Bloom 
                luminanceThreshold = { values.bloomThreshold } 
                luminanceSmoothing = { values.bloomSmoothing } 
                intensity          = { values.bloomIntensity }
                mipmapBlur         = { false }
                
            /> 
        )}

    </ EffectComposer>;
}
