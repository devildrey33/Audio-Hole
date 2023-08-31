import { useState, useRef, useEffect } from "react"
import songs from "../Config/Songs.jsx"
import audio from "../AudioAnalizer.jsx";

let isChangingTime = false;

export default function UI_AudioControls({ 
    getCurrentSong, setCurrentSong, getIsPlaying, setIsPlaying }) {

    // Reference to time slider
    const refTime = useRef();
    // Reference to volume slider
    const refVolume = useRef();
    // Reference to the combobox with the songs
    const comboSongs = useRef();

    // Run after first render
    useEffect(() => {
        // setup audio controls link between UI and the AudioAnalizer
        audio.refTime           = refTime;
    }, []);


    // When user changes the volume
    const volumeChange = (e) => {
        console.log(e);
        audio.volume(e.currentTarget.value);
    }

    // When user changes the song
    const songChange = (e) => {
        setCurrentSong(parseInt(comboSongs.current.value));
        const song = songs[parseInt(comboSongs.current.value)];
        audio.loadSong(song.path);
        return audio.playPause(song.path);
    }

    // Click event for play button
    const playPauseClick = () => {
        setIsPlaying(audio.playPause(songs[getCurrentSong].path));
    }

    // Mouse down on time slider
    const sliderTimeMouseDown = () => {
        audio.isChangingTime = true;
    }

    // Mouse up on time slider
    const sliderTimeMouseUp = () => {
        audio.isChangingTime = false;
        audio.setTime(refTime.current.value);
    }


    //console.log(currentSong);

    return <>
        { /* Play / Pause button */ }
        <div onClick = { playPauseClick } className="Experience_Play Experience_Panel Experience_Control">
            { (getIsPlaying) ? <img draggable='false' src='icos.svg#svg-pause' />
                             : <img draggable='false' src='icos.svg#svg-play'  /> }            
        </div>

        <div className='Experience_AudioControls'>
            { /* Song selection and volume controls */ }
            <div className="Experience_AC_SongsVolume">
                <span>song</span>
                <select ref={ comboSongs } name='songs' defaultValue= { getCurrentSong } onChange={ songChange }> {
                        songs.map((item, index) => {
                            return <option key={ index } value= { index }>{ item.name }</option>
                        })
                    }
                </select>
                <span>volume</span>
                <div className='Experience_AC_Volume'>
                    <input 
                        ref          = { refVolume } 
                        type         = 'range' 
                        name         = 'volume' 
                        step         = { 0.01 }
                        min          = { 0 }
                        max          = { 2 }
                        defaultValue = { 0.5 }
                        onChange     = { volumeChange } ></input>
                </div>
            </div>

            { /* Time slider */ }
            <div className='Experience_AC_Time'>
                <input 
                    onMouseDown  = { sliderTimeMouseDown } 
                    onMouseUp    = { sliderTimeMouseUp } 
                    ref          = { refTime } 
                    type         = 'range'
                    step         = { 0.01 }
                    defaultValue = { 0 }
                ></input>
            </div>
        </div>
    </>
}