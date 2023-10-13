import * as THREE from 'three'
import songs from "./Config/songs.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import HTMLElements from "./Utils/HTMLElements.js";
import options from "./Config/options.js";
import AudioAnalizerSC from "./Utils/AudioAnalizerSC.js";
import AudioAnalizerMC from "./Utils/AudioAnalizerMC.js";
import Camera from './Camera.js';
//import Renderer from './Renderer.js';
import Renderer from './Renderer_pmndrs.js';

import World from './World/World.js';
import Debug from './Utils/Debug.js';
import Resources from './Utils/Resources.js';
import sources from "./Config/resourcesToLoad.js"
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
        this.currentSong = Math.floor(Math.random() * this.songs.length);
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

        this.resources      = new Resources(sources);
        this.loading = true;

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
//        this.resources      = new Resources(sources);
        this.camera         = new Camera();
        this.world          = new World();
        this.renderer       = new Renderer();


        if (this.options.debug === false) {
            this.updateDebug = () => {}
//            this.AudioTimeUpdate = () => {}
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
//        this.htmlElements.elementExperience.setAttribute("loading", "false");
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

    setQuality(preset = "high") {       
        // Setup low config (high is the standard)
        if (preset === "low") {
            this.options.audioFFTSize      = 1024;
            this.options.audioMultiChannel = false;
        }

        // Update the loading function to catch loaded songs
        this.setLoading = this.setLoadingAudio;
        this.setLoading();

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
        

        if (this.options.debug) {
            this.debug = new Debug();
            this.debugAverages = new DebugAverages((this.options.audioMultiChannel) ? 300 : 50, 80);
        }
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
    }

    /**
     * Function called when a frame is about to update (before the world objects creation)
    */
    update() {
        this.camera.update();

        this.world.update();
        this.renderer.update();
    }

    /**
     * Function called when a frame is about to update (after the world objects creation)
    */
    updateQuality() {
        this.camera.update();
        this.audioAnalizer.update(this.time.delta);

        this.world.update();
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

    setLoading() {
        let isLoading = true;
        if (this.loading === false) isLoading = false;
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    setLoadingAudio() {
        let isLoading = true;
        if (this.loading === false && this.songLoading === false) isLoading = false;
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    /* 
     * Audio events
     */
    onAudioPlay = () => {
        this.htmlElements.audioUI(false); 
    }

    onAudioPause = () => { 
        this.htmlElements.audioUI(true);
    }

    onAudioEnded = () => { 
        this.htmlElements.audioUI(true);
        this.beats = 0;
    }
    

    onAudioTimeUpdate = (currentTime) => {
        if (this.htmlElements.dragTime == false)
            this.htmlElements.elementAudioTime.value = currentTime;        
    }

    onAudioDurationChange = (newDuration) => {
        if (this.options.debug === true) {
            // Update max time on the time slider
            this.htmlElements.elementAudioTime.setAttribute("max", newDuration);
        }

        this.song.bpmMS = (60000 / this.song.bpm);
        if (this.options.showBPM === true) {
            this.htmlElements.elementTxtBPM.innerHTML = Math.floor(this.song.bpmMS);
        }
        
        // setup animations
        this.world.setupSong();
    }

    onAudioError = () => {
        this.songLoading = false; 
        this.beats = 0;
        this.setLoading();
        this.htmlElements.audioUI(true);
        window.alert("error loading : " + this.song.path);
    }

    onAudioCanPlay = () => {
        this.songLoading = false;
        this.beats = 0;
        this.setLoading();
    }

    onAudioLoading = () => {
        this.songLoading = true;
        this.setLoading();
        this.htmlElements.audioUI(true);    
    }

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
        
        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }    
}