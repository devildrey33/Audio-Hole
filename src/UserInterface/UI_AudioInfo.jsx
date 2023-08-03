import { useRef, useState } from "react";
import songs from "../Config/Songs.jsx";

export default function UI_AudioInfo({ getCurrentSong, getIsPlaying }) {
//    console.log(songs[currentSong].group);
    const name   = useRef();
    const artist = useRef();

    return <div className="Experience_Panel Experience_SongInfo" visible= { `${getIsPlaying}` }>
        <span>Name</span>
        <span>:</span>
        <a ref= { name } href={ `${songs[getCurrentSong].url}` } target="_blank">{ songs[getCurrentSong].name }</a>
        <span>Artist</span>
        <span>:</span>
        <a ref= { artist } href={ `${songs[getCurrentSong].url}` } target="_blank">{ songs[getCurrentSong].group }</a>
    </div>
}