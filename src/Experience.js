import * as THREE from 'three'
import songs from "./Config/songs.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import HTMLElements from "./Utils/HTMLElements.js";
import options from "./Config/options.js";
import AudioAnalizer from "./Utils/AudioAnalizer.js";
import Camera from './Camera.js';
//import Renderer from './Renderer.js';
import Renderer from './Renderer_pmndrs.js';

import World from './World/World.js';
import Debug from './Utils/Debug.js';


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

        // default options
        this.options = options;

        // Initialize canvas size
        this.sizes          = new Sizes();
        // Create the html tags and insert into body (canvas, buttons, fps, loading and error messages)
        this.htmlElements   = new HTMLElements();
        // Initialize time
        this.time           = new Time();

        this.audioAnalizer  = new AudioAnalizer();
        this.audioAnalizer.loadSong(this.song.path);
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
        this.sizes.on('resize', () => { this.resize(); })
        this.time.on ('tick'  , () => { this.update(); })
    }

    // Get loading state
    get loading() {
        let Ret = this.htmlElements.elementExperience.getAttribute("loading");
        return (Ret === "true" || Ret === true);
    }

    // Set loading state
    set loading(isLoading) {
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
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
        this.audioAnalizer.update();
        this.world.update();
        this.renderer.update();
    }
 



    /** 
     * This function destroy the whole scene
     */
    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

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