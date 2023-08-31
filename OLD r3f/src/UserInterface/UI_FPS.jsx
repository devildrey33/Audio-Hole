import { useRef } from "react";

export default function UI_FPS({ getFps }) {
    const refFps = useRef();
    const part = 256 / 60;
    const color = "rgb(" + Math.round(255 - (getFps * part)) + "," + Math.round(getFps * part) + ", 0)";

    return <div className='Experience_Panel Experience_Static' title='Frames Per Second'>
        <div ref={ refFps } style= { { color : color } }className='Experience_FPS'>{ getFps }</div>
        <div className='Experience_TxtFPS'>fps</div>
    </div>
}