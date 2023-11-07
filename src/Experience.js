import * as THREE from 'three'
import options from "./Config/options.js";
import songs from "./Config/songs.js";
import sources from "./Config/resourcesToLoad.js"
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import HTMLElements from "./Utils/HTMLElements.js";
import AudioAnalizerSC from "./Utils/AudioAnalizerSC.js";
import AudioAnalizerMC from "./Utils/AudioAnalizerMC.js";
import Camera from './Camera.js';
//import Renderer from './Renderer.js';
import Renderer from './Renderer_pmndrs.js';
import Resources from './Utils/Resources.js';

import World from './World/World.js';
import Debug from './Utils/Debug.js';
import DebugAverages from './Utils/DebugAverages.js';


let experienceInstance = null;

export default class Experience {
    // Constructor
    constructor() {
        // Look for previous instance
        if (experienceInstance) {
            // return the previous instance
            return experienceInstance;
        }
        experienceInstance = this;
        
        // Setup the songs list
        this.songs = songs;
        // select a random song
//        this.currentSong = Math.floor(Math.random() * this.songs.length);
        this.currentSong = 0;
        this.song = this.songs[this.currentSong];
        this.songLoading = true;

        // default options
        this.options = options;

        // Initialize canvas size
        this.sizes          = new Sizes();
        // Create the html tags and insert into body (canvas, buttons, fps, loading and error messages)
        this.htmlElements   = new HTMLElements();
        // Initialize time
        this.time           = new Time();
        // Start loading resource files
        this.resources      = new Resources(sources);
        // Set loading to true
        this.loading = true;

        // Initialize audio analizer options and callbacks
        this.audioAnalizerOptions = {
            onPlay           : this.onAudioPlay,
            onPause          : this.onAudioPause,
            onTimeUpdate     : (this.options.debug) ? this.onAudioTimeUpdate : function() {},
            onDurationChange : this.onAudioDurationChange,
            onEnded          : this.onAudioEnded,
            onError          : this.onAudioError,
            onCanPlay        : this.onAudioCanPlay,
            onLoading        : this.onAudioLoading, 
            onBpmChange      : this.onAudioBpmChange,
            allowDropSong    : this.options.songsDragDrop,
            volume           : this.options.audioVolume,
            fftSize          : this.options.audioFFTSize
        }

        // Set the canvas element
        this.canvas         = this.htmlElements.elementCanvas;

        this.scene          = new THREE.Scene();
        this.camera         = new Camera();
        this.world          = new World();
        this.renderer       = new Renderer();

        // Remove the updateDebug function if the experience is not on debug mode
        if (this.options.debug === false) {
            this.updateDebug = () => {}
        }
        

        // Listen events
        this.sizes.on    ('resize', () => { this.resize(); })
        this.time.on     ('tick'  , () => { this.update(); })
        this.resources.on('ready' , () => { this.resourcesLoaded(); })

        // ShockWave click...
/*        if (this.options.debug === true && typeof(this.renderer.shockWaveEffect) !== "undefined") {
            this.canvas.addEventListener("click", (e) => { 
                this.renderer.shockWaveEffect.explode(); 
            });
        }*/

        this.beats = 0;

        this.time.measureQuality();
    }

    /* 
     * Recomends the experience quality using an average of fps taken during the first 3 seconds
     */
    recomended(value) {
        // A value of 50 means an high end machine
        if (value > 50) {
            if (typeof(this.htmlElements.elementQualityHigh) !== "undefined")
                this.htmlElements.elementQualityHigh.setAttribute("recomended", "true");
        }
        // A value below 50 means a low end machine
        else {
            if (typeof(this.htmlElements.elementQualityLow) !== "undefined")
                this.htmlElements.elementQualityLow.setAttribute("recomended", "true");
        }
    }

    /*
     * Sets the quality for the experience 
     *  preset can be "low" or "high"
     */
    setQuality(preset = "high") {       
        // Setup low config (high is the standard)
        if (preset === "low") {
            this.options.audioFFTSize      = 1024;   // 512 values
            this.options.audioMultiChannel = false;  // only one channel analisis
        }

        // Update the loading function to catch loaded songs
        this.setLoading = this.setLoadingAudio;
        this.setLoading();

        // Start the audio analizer & player
        if (this.options.audioMultiChannel === true) 
            this.audioAnalizer  = new AudioAnalizerMC(this.audioAnalizerOptions);
        else
            this.audioAnalizer  = new AudioAnalizerSC(this.audioAnalizerOptions);

        // Create meshes that need audio analizer
        this.world.setQuality();
        // Setup the god rays for the sun mesh
        this.renderer.setGodRays(this.world.sun.mesh);
        // Load the song
        this.audioAnalizer.loadSong(this.song.path, this.song.bpm);
        // Apply the new update function
        this.update = this.updateQuality;
        // Enable play button
        this.htmlElements.elementPlay.setAttribute("disabled", "false");

        // Enable help tooltips
        this.htmlElements.elementPressPlay.setAttribute("show", "true");
        this.htmlElements.elementPressFullScreen.setAttribute("show", "false");

        // Start debug mode
        if (this.options.debug) {
            this.debug = new Debug();
            // Create a DebugAverages object with 300 of width if is multi channel or 50 if is single channel
            this.debugAverages = new DebugAverages((this.options.audioMultiChannel) ? 300 : 50, 80);
        }
        // Release mode
        else {
            // Create an empty debugAverages object to simulate its update function
            this.debugAverages = { update : () => { } }
        }

    }

    /**
     * Function called on resize
     */
    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.world.background.resize();
    }

    /**
     * Function called when a frame is about to update (before the world objects creation)
    */
    update() {        
        const delta = this.time.delta;
        this.camera.update();

        this.world.update(delta);
        this.renderer.update(delta);
    }

    /**
     * Function called when a frame is about to update (after the world objects creation)
    */
    updateQuality() {
        const delta = this.time.delta;
        this.camera.update();
        this.audioAnalizer.update(delta);

        this.world.update(delta);
        this.renderer.update();

        this.debugAverages.update();
    }

 
    /**
     * Function called when all thre resources are loaded (except the song)
     */
    resourcesLoaded() {
        this.loading = false;
        this.setLoading();
        this.world.resourcesLoaded();
    }

    /*
     * Initial setLoading function (this function is replaced by setLoadingAudio when whe can load songs)
     */
    setLoading() {
        let isLoading = true;
        if (this.loading === false) isLoading = false;
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    /*
     * Final setLoading function when whe can load songs
     */
    setLoadingAudio() {
        let isLoading = true;
        if (this.loading === false && this.songLoading === false) isLoading = false;
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    /* 
     * Audio events
     */

    // Audio play
    onAudioPlay = () => {
        this.htmlElements.audioUI(false); 
    }

    // Audio pause
    onAudioPause = () => { 
        this.htmlElements.audioUI(true);
    }

    // Audio has reached the end
    onAudioEnded = () => { 
        this.htmlElements.audioUI(true);
        this.beats = 0;

        if (this.options.showBPM === true) {
            this.htmlElements.elementDebugEffects.innerHTML = "";
        }
    }
    
    // Audio time has changed (this function is only for debug, in release mode its an empty function)
    onAudioTimeUpdate = (currentTime) => {
        if (this.htmlElements.dragTime == false)
            this.htmlElements.elementAudioTime.value = currentTime;        
    }

    // Whe know for the first time the audio total time
    onAudioDurationChange = (newDuration) => {
        if (this.options.debug === true) {
            // Update max time on the time slider
            this.htmlElements.elementAudioTime.setAttribute("max", newDuration);
        }
        // Calculate how much miliseconds has one beat
        this.song.bpmMS = (60000 / this.song.bpm);
        if (this.options.showBPM === true) {
            this.htmlElements.elementTxtBPM.innerHTML = Math.floor(this.song.bpmMS);
        }
    }

    // Event error
    onAudioError = () => {
        this.songLoading = false; 
        this.beats = 0;
        this.setLoading();
        this.htmlElements.audioUI(true);
        window.alert("error loading : " + this.song.path);
    }

    // Song its ready to play
    onAudioCanPlay = () => {
        // Setup animations, and asociate channels
        // ONLY IF SONG IS LOADING (I dont know why canPlay event trigers sometimes in the middle of the song)
        if (this.songLoading === true) {
            this.world.setupSong();
        }

        this.songLoading = false;
        this.beats = 0;
        this.setLoading();


    }

    // Start loading song
    onAudioLoading = () => {
        this.songLoading = true;
        this.setLoading();
        this.htmlElements.audioUI(true);    
    }

    // Current Beat Per Minute has changed
    onAudioBpmChange = (currentBpm) => {
        if (this.options.showBPM === true) 
            this.htmlElements.elementBPM.innerHTML = currentBpm;
    }

    /** 
     * This function destroy the whole scene
     */
    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');
        this.resources.off('ready');

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof(value.dispose) === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        // orbit
        this.camera.controls.dispose();
        // renderer
        this.renderer.instance.dispose();
        
        // remove debug ui
        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }    
}