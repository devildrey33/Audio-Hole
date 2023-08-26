import { OrbitControls, Float, TransformControls, MeshReflectorMaterial, Environment, CameraShake } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useState } from "react";
import options from './Config/Options.jsx';
import audio from './AudioAnalizer.jsx';
import Spirals from './World/Objects/Spirals.jsx'
import Roof from './World/Objects/Roof.jsx';
import * as THREE from "three"
import PerlinSun from './World/Objects/PerlinSun.jsx';
import Postprocessing from './World/PostProcessing.jsx';
import LinearOsciloscope from './World/Objects/LinearOsciloscope.jsx';

let currentTime = 0;
let actualFrame = 0;
let fps = 60;

export default function World ({ setFps }) {
    const { camera, mouse } = useThree();
    const spiralMeshRef = useRef();    
    const perlinSunRef = useRef();
    const [vec] = useState(() => new THREE.Vector3());
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

        // Rotate the spiral mesh
        spiralMeshRef.current.rotation.y += delta;

        // Update camera position
        camera.position.lerp(vec.set(mouse.x * 1.5, mouse.y * 1.5, 10), 0.05);
    });




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

        <LinearOsciloscope />

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

        <CameraShake
             maxYaw         ={0.033} 
             maxPitch       ={0.05} 
             maxRoll        ={0.041} 
             yawFrequency   ={0.35} 
             pitchFrequency ={0.25} 
             rollFrequency  ={0.14} 
        />

        { /* Postprocessing */ }
{        
            <Postprocessing sunRef={ perlinSunRef } />
          }  

    </>
}