import * as THREE from 'three'
import songs from "./Config/songs.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import HTMLElements from "./Utils/HTMLElements.js";
import options from "./Config/options.js";
import AudioAnalizer from "./Utils/AudioAnalizer.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
//import Renderer from './Renderer_pmndrs.js';

import World from './World/World.js';
import Debug from './Utils/Debug.js';
import Resources from './Utils/Resources.js';
import sources from "./Config/resourcesToLoad.js"


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
        this.song = this.songs[Math.floor(Math.random() * this.songs.length)];
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

        this.audioAnalizer  = new AudioAnalizer({
            onPlay           : this.onAudioPlay,
            onPause          : this.onAudioPause,
            onTimeUpdate     : this.onAudioTimeUpdate,
            onDurationChange : this.onAudioDurationChange,
            onEnded          : this.onAudioEnded,
            onError          : this.onAudioError,
            onCanPlay        : this.onAudioCanPlay,
            onLoading        : this.onAudioLoading, 
            onBpmChange      : this.onAudioBpmChange,
            allowDropSong    : this.options.songsDragDrop,
            volume           : this.options.audioVolume
        });
        this.audioAnalizer.loadSong(this.song.path, this.song.bpm);
        // Set the canvas element
        this.canvas         = this.htmlElements.elementCanvas;

        this.scene          = new THREE.Scene();
//        this.resources      = new Resources(sources);
        this.camera         = new Camera();
        this.world          = new World();
        this.renderer       = new Renderer(this.world.sun.mesh, this.world.spirals.mesh);

        if (this.options.debug === true) {
            this.debug      = new Debug();
        }
        

        // Listen events
        this.sizes.on    ('resize', () => { this.resize(); })
        this.time.on     ('tick'  , () => { this.update(); })
        this.resources.on('ready' , () => { this.resourcesLoaded(); })

        if (this.options.debug === true) {
            this.canvas.addEventListener("click", (e) => { 
                this.renderer.shockWaveEffect.explode(); 
            });
        }

        this.beats = 0;
    }

    /**
     * Function called on resize
    */
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    /**
     * Function called when a frame is about to update
    */
    update() {
        this.camera.update();
        this.audioAnalizer.update(this.time.delta);
        this.world.update();
        this.renderer.update();
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
        // Update max time on the time slider
        this.htmlElements.elementAudioTime.setAttribute("max", newDuration);

        this.song.bpmMS = (60000 / this.song.bpm);
        if (this.options.showBPM === true) {
            this.htmlElements.elementTxtBPM.innerHTML = Math.floor(this.song.bpmMS);
        }
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
/*        this.beats ++;
        if (this.beats === 32) {
            this.renderer.shockWaveEffect.explode();
            this.beats = 0;
        }*/
        if (this.options.showBPM === true) this.htmlElements.elementBPM.innerHTML = currentBpm;
//        console.log("Bpm : " + this.audioAnalizer.bpm + " Current beat : " + currentBpm);
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