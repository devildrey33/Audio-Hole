import { OrbitControls, Float, TransformControls, MeshReflectorMaterial, Environment } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react";
import options from './Config/Options.jsx';
import audio from './AudioAnalizer.jsx';
import Spirals from './World/Objects/Spirals.jsx'
import { useControls } from 'leva'
import Roof from './World/Objects/Roof.jsx';
import * as THREE from "three"
import PerlinSun from './World/Objects/PerlinSun.jsx';
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, Noise } from '@react-three/postprocessing'
import Postprocessing from './World/PostProcessing.jsx';

let currentTime = 0;
let actualFrame = 0;
let fps = 60;

export default function World ({ setFps }) {
    const camera = useThree((state) => state.camera);
    const spiralMeshRef = useRef();    
    const perlinSunRef = useRef();
    
//    const mesh = useRef();

    const calculateFps = () => {
        if (currentTime > actualFrame) {
            actualFrame = currentTime + 1;
            setFps(fps);
            fps = 0;
        }
        else {
            fps ++;
        }
    }

    useFrame((state, delta) => {        

        // Update audio textures and song time slider
        audio.update();

        // Calculate the current fps
        currentTime = state.clock.elapsedTime;
        calculateFps();

        spiralMeshRef.current.rotation.y += delta;

        camera.rotation.z -= delta *0.002;
//        spiralMesh.coneUniforms.uTime = state.clock.elapsedTime;
    });

//    const directionalRef = useRef();
//    const spotRef = useRef();


    if (options.debug) {
/*        useControls('Directional Light', {
            visible  : { value: true,
                         onChange: (v) => { directionalRef.current.visible = v }, },
            position : { x: 1, y: 1, z: -5, 
                         onChange: (v) => { directionalRef.current.position.copy(v) }, },
            color    : { value: 'white',
                         onChange: (v) => { directionalRef.current.color = new THREE.Color(v) }, },
            intensity: { value : 5, min : 0, max : 10, step : 0.1, 
                         onChange: (v) => { directionalRef.current.intensity = v } }
        })

        /*useControls('Spot Light', {
            visible  : { value: false,
                        onChange: (v) => { spotRef.current.visible = v }, },
            position : { x: -2, y: 2, z: -5, 
                        onChange: (v) => { spotRef.current.position.copy(v) }, },
            color    : { value: 'white',
                        onChange: (v) => { spotRef.current.color = new THREE.Color(v) }, },
            intensity: { value : 5, min : 0, max : 10, step : 0.1, 
                        onChange: (v) => { spotRef.current.intensity = v } }
        })*/
    }




    return <>

        { /* Orbit controls */ }
        { (options.orbitControls && options.debug) ? <OrbitControls makeDefault /> : null }
        
        { /* Environment lightmap */ }
        <Environment preset="city" />

        { /* lights */ }
        { /* <directionalLight ref={directionalRef} position={[1, 1, -5]} /> */ }
        { /*<spotLight ref={spotRef} position={[-2, 2, -5]} /> */ }

        { /* main spirals */ }
        <Spirals meshRef={spiralMeshRef} debug={ options.debug } />
            
        { /*<Roof debug={ options.debug } /> */ }
        <Float
            speed={1} // Animation speed, defaults to 1
            rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
            floatIntensity={0.02} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
            floatingRange={[10, 1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
            <PerlinSun meshRef={ perlinSunRef } debug={ options.debug } />
        </Float>

        { /* reflective floor */ }
      { /* <mesh rotation-x= { -Math.PI * 0.5 } position-y = { - 8} position-z={ -22 } >
            <planeGeometry args={ [ 256, 64, 32,32 ]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={800}
                roughness={0.75}
                depthScale={50}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={1}          
            />
        </mesh>    */    }


        { /* Postprocessing */ }
{        
            <Postprocessing sunRef={ perlinSunRef } />
          }  

    </>
}