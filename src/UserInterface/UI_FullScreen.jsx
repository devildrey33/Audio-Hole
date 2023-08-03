import { useState } from "react"

export default function UI_FullScreen() {
    const [getIsFullScreen, setIsFullScreen] = useState(false);

    // Click event for full screen button
    const fullScreenButtonClick = () => {
        setIsFullScreen(!getIsFullScreen);
        const DomExperience = document.getElementsByClassName("Experience")[0];
//        const DomExperience = document.getElementsById("root");
        if (getIsFullScreen === false) DomExperience.requestFullscreen();
        else                           document.exitFullscreen();
    }

    return <div onClick = { fullScreenButtonClick } id='fullScreen' className='Experience_Panel Experience_Control' title='Full screen mode'>
        {   // Set svg icon depending on full screen state
            (getIsFullScreen) ? <img draggable='false' src='icos.svg#svg-restaurar-pantalla' /> 
                              : <img draggable='false' src='icos.svg#svg-pantalla-completa'  /> }
    </div>
}