import { OrbitControls, PivotControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react";
import options from './Config/Options.jsx';
import audio from './AudioAnalizer.jsx';
import Spirals from './World/Spirals.jsx'
import { useControls } from 'leva'

let currentTime = 0;
let actualFrame = 0;
let fps = 60;

export default function World ({ setFps }) {
    const camera = useThree((state) => state.camera);
    const spiralMesh = useRef();
    
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

        spiralMesh.current.rotation.y += delta;
//        spiralMesh.coneUniforms.uTime = state.clock.elapsedTime;
    });


    return <>
        { /* Orbit controls */ }
        { (options.orbitControls) ? <OrbitControls makeDefault /> : null }
        
        <directionalLight />

        <Spirals spiralMesh={spiralMesh}></Spirals>
    </>
}