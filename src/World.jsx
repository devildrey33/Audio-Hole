import { OrbitControls, PivotControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react";
import options from './Config/Options';
import audio from './AudioAnalizer';

let currentTime = 0;
let actualFrame = 0;
let fps = 60;

export default function World ({ setFps }) {
    const camera = useThree((state) => state.camera);
    
    const mesh = useRef();

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
        mesh.current.rotation.y += delta;

        // Update audio textures and song time slider
        audio.update();

        // Calculate the current fps
        currentTime = state.clock.elapsedTime;
        calculateFps();
    });


    return <>
        { /* Orbit controls */ }
        { (options.orbitControls) ? <OrbitControls makeDefault /> : null }
        
        <directionalLight />
        <mesh ref ={ mesh } >
            <torusKnotGeometry />
            <meshStandardMaterial />
        </mesh>
    </>
}