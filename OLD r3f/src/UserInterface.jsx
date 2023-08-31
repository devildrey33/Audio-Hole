import { Canvas } from '@react-three/fiber'
import World from './World.jsx'
import options from "./Config/Options.jsx";
import UI_Loading from "./UserInterface/UI_Loading.jsx";
import UI_FullScreen from "./UserInterface/UI_FullScreen.jsx";
import UI_FPS from "./UserInterface/UI_FPS.jsx";
import { useEffect, useState } from "react";
import UI_Github from "./UserInterface/UI_Github.jsx";
import UI_Logo from "./UserInterface/UI_Logo.jsx";
import UI_AudioInfo from "./UserInterface/UI_AudioInfo.jsx";
import UI_AudioControls from "./UserInterface/UI_AudioControls.jsx";
import songs from "./Config/Songs.jsx"
import audio from "./AudioAnalizer.jsx";
import { PerspectiveCamera } from '@react-three/drei';

export default function UserInterface () {

    // Buton play / pause state
    const [getIsPlaying, setIsPlaying] = useState(false);

    // Create a reactive value for loading
    const [getLoading, setLoading] = useState(true);

    // Create a random number from 0 to max songs
    const [getCurrentSong, setCurrentSong] = useState(Math.floor(Math.random() * songs.length));

    // State for fps counter
    const [getFps, setFps] = useState(60);

    useEffect(() => {
        // fisrt render        
        // setup audio controls link between UI and the AudioAnalizer
        audio.setLoading   = setLoading;
        audio.setIsPlaying = setIsPlaying;
        setLoading(false);
    }, []);
    

    return <div className="Experience" loading={ getLoading.toString() }>
        {/* Loading pannel */}
        <UI_Loading />

        <div className="Experience_Controls">
            {/* FPS pannel */}
            { (options.showFPS)           ? <UI_FPS getFps = { getFps } />          : null }

            {/* Full-screen / restore screen button */}
            { (options.buttonFullScreen)  ? <UI_FullScreen />   : null }

            {/* Github button */}
            { (options.buttonGitHub)      ? <UI_Github />       : null }

            {/* Logo button */}
            { (options.buttonLogo)        ? <UI_Logo />         : null }        
        </div>
        
        {/* Song information */}
        <UI_AudioInfo 
            getCurrentSong = { getCurrentSong } 
            getIsPlaying = { getIsPlaying } 
        />
        
        {/* Songs selection and volume */}
        <UI_AudioControls 
            getCurrentSong    = { getCurrentSong    } 
            setCurrentSong    = { setCurrentSong    }
            setIsPlaying      = { setIsPlaying      } 
            getIsPlaying      = { getIsPlaying      } 
        />

        {/* Canvas */}
        <Canvas className="Experience_Canvas">
            
            <World 
                setFps            = { setFps } 
            />
        </Canvas>
    </div>;
}